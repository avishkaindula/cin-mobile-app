import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";
import { authService } from "./auth.service";
import { BASE_URL } from "@/lib/constants";
import {
  OAuthProvider,
  OAuthResponse,
  GoogleTokenExchangeRequest,
  GoogleTokenResponse,
  CreateSessionFromUrlRequest,
  SessionResponse,
} from "@/types/auth";

/**
 * OAuthService - OAuth provider integrations
 * 
 * Handles OAuth flows for various providers like GitHub and Google
 */

// Utility function to check if URL contains auth parameters
const hasAuthParameters = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    const hashFragment = urlObj.hash.substring(1);
    const hashParams = new URLSearchParams(hashFragment);

    // Check for various auth parameters
    return !!(
      searchParams.get("code") ||
      searchParams.get("access_token") ||
      searchParams.get("error") ||
      hashParams.get("access_token") ||
      hashParams.get("error") ||
      hashParams.get("refresh_token")
    );
  } catch {
    return false;
  }
};

export class OAuthService {
  private static instance: OAuthService;

  public static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  /**
   * Sign in with Apple (iOS only)
   */
  async signInWithApple(): Promise<OAuthResponse> {
    try {
      // Check if Apple Sign In is available
      if (Platform.OS !== "ios") {
        return { error: new Error("Apple Sign In is only available on iOS") };
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        return { error: new Error("Apple Sign In is not available on this device") };
      }

      // Request Apple Sign In
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Sign in via Supabase Auth with the identity token
      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } else {
        return { error: new Error("No identity token received from Apple") };
      }
    } catch (error: any) {
      // Handle specific Apple Sign In errors
      if (error.code === "ERR_REQUEST_CANCELED") {
        return { error: new Error("Apple Sign In was cancelled") };
      }
      
      return { error: error as Error };
    }
  }

  /**
   * Sign in with GitHub OAuth
   */
  async signInWithGitHub(redirectTo?: string): Promise<OAuthResponse> {
    try {
      const finalRedirectTo = redirectTo || this.getRedirectUrl();

      if (Platform.OS === "web") {
        // For web, use standard OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: finalRedirectTo,
          },
        });

        return { 
          error,
          url: data?.url || undefined,
          needsRedirect: true,
        };
      } else {
        // For mobile, use deep linking flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: finalRedirectTo,
            skipBrowserRedirect: true,
          },
        });

        if (error) {
          return { error };
        }

        if (data?.url) {
          const res = await WebBrowser.openAuthSessionAsync(
            data.url,
            finalRedirectTo
          );

          if (res.type === "success") {
            await this.createSessionFromUrl({ url: res.url, platform: "mobile" });
            return { error: null };
          }

          return { error: new Error("OAuth cancelled") };
        }

        return { error: new Error("No OAuth URL received") };
      }
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Exchange Google authorization code for tokens
   */
  async exchangeGoogleCode({
    code,
    codeVerifier,
    platform = Platform.OS as "web" | "mobile",
  }: GoogleTokenExchangeRequest): Promise<{ 
    access_token: string; 
    refresh_token: string; 
    error?: Error;
  }> {
    try {
      console.log("Starting Google OAuth token exchange...");
      
      // Create form data to send to our token endpoint
      const formData = new FormData();
      formData.append("code", code);
      formData.append("platform", platform);

      if (codeVerifier) {
        formData.append("code_verifier", codeVerifier);
      } else {
        console.warn("No code verifier provided");
      }

      // Send the authorization code to our token endpoint
      console.log("Exchanging code for tokens...");
      const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
        method: "POST",
        body: formData,
      });

      const userData = await tokenResponse.json();
      console.log("Token exchange response received");

      if (!tokenResponse.ok) {
        throw new Error(userData.error || "Token exchange failed");
      }

      if (!userData.access_token || !userData.refresh_token) {
        throw new Error("Invalid token response");
      }

      return {
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      };
    } catch (error) {
      console.error("Error exchanging Google code:", error);
      return {
        access_token: "",
        refresh_token: "",
        error: error as Error,
      };
    }
  }

  /**
   * Create session from OAuth callback URL
   */
  async createSessionFromUrl({ url, platform }: CreateSessionFromUrlRequest): Promise<SessionResponse> {
    try {
      // Early check to avoid processing URLs without auth parameters
      if (!hasAuthParameters(url)) {
        return { error: new Error("NO_AUTH_PARAMETERS") };
      }

      if (platform === "web" || Platform.OS === "web") {
        return this.handleWebOAuthCallback(url);
      } else {
        return this.handleMobileOAuthCallback(url);
      }
    } catch (error) {
      console.error("Error creating session from URL:", error);
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Handle web OAuth callback
   */
  private async handleWebOAuthCallback(url: string): Promise<SessionResponse> {
    try {
      // Parse both query parameters and hash fragments
      const urlObj = new URL(url);
      const searchParams = urlObj.searchParams;
      const hashFragment = urlObj.hash.substring(1); // Remove the #
      const hashParams = new URLSearchParams(hashFragment);

      // Check for authorization code (PKCE flow)
      const code = searchParams.get("code");
      const error_description =
        searchParams.get("error_description") ||
        hashParams.get("error_description");

      if (error_description) {
        throw new Error(error_description);
      }

      if (code) {
        // Exchange authorization code for session (PKCE flow)
        const result = await authService.exchangeCodeForSession(code);

        if (result.error) {
          console.error("Error exchanging code:", result.error);
          throw result.error;
        }

        // Clean the URL after processing (but only if not on reset-password page)
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/reset-password")
        ) {
          window.history.replaceState({}, "", window.location.pathname);
        }

        return result;
      }

      // Fallback: Check for direct access token (implicit flow)
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (access_token) {
        const result = await authService.setSession(
          access_token,
          refresh_token || ""
        );

        if (result.error) {
          throw result.error;
        }

        // Clean the URL after processing
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", window.location.pathname);
        }

        return result;
      }

      return { error: new Error("NO_AUTH_PARAMETERS") };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Handle mobile OAuth callback
   */
  private async handleMobileOAuthCallback(url: string): Promise<SessionResponse> {
    try {
      // For mobile, use the existing QueryParams approach
      const { params, errorCode } = QueryParams.getQueryParams(url);

      if (errorCode) {
        throw new Error(errorCode);
      }

      const { access_token, refresh_token, code } = params;

      if (code) {
        // Exchange authorization code for session (PKCE flow)
        return await authService.exchangeCodeForSession(code);
      }

      if (access_token) {
        return await authService.setSession(access_token, refresh_token);
      }

      return { error: new Error("NO_AUTH_PARAMETERS") };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  // Private helper methods
  private getRedirectUrl(): string {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.location.origin;
    }
    // For mobile, you would use your deep link URL
    return "com.mission15://";
  }
}

// Export singleton instance
export const oauthService = OAuthService.getInstance();
