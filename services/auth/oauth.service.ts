import { supabase } from "@/lib/supabase";
import { AuthResult, OAuthOptions } from "@/types/auth";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";

/**
 * OAuth Service
 * 
 * Handles OAuth authentication flows for third-party providers
 * like GitHub, Google, etc.
 */
class OAuthService {
  /**
   * Sign in with GitHub
   */
  async signInWithGitHub(options?: OAuthOptions): Promise<AuthResult> {
    try {
      if (Platform.OS === "web") {
        // For web, use standard OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: options?.redirectTo,
          },
        });
        return { error };
      } else {
        // For mobile, use deep linking flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: options?.redirectTo,
            skipBrowserRedirect: options?.skipBrowserRedirect ?? true,
          },
        });

        if (error) throw error;

        const res = await WebBrowser.openAuthSessionAsync(
          data?.url ?? "",
          options?.redirectTo ?? ""
        );

        if (res.type === "success") {
          const { url } = res;
          return await this.createSessionFromUrl(url);
        }

        return { error: new Error("OAuth cancelled") };
      }
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Sign in with Google
   * Note: This method initiates the OAuth flow but the actual token exchange
   * happens in the auth context using expo-auth-session
   */
  async signInWithGoogle(options?: OAuthOptions): Promise<AuthResult> {
    try {
      // For Google OAuth, we use expo-auth-session which is handled in the auth context
      // This method is here for completeness and future customization
      return { error: new Error("Google OAuth should be handled through expo-auth-session") };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Create session from OAuth redirect URL
   */
  async createSessionFromUrl(url: string): Promise<AuthResult> {
    try {
      if (Platform.OS === "web") {
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

        if (error_description) throw new Error(error_description);

        if (code) {
          // Exchange authorization code for session (PKCE flow)
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error("Error exchanging code:", error);
            throw error;
          }

          // Clean the URL after processing (but only if not on reset-password page)
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/reset-password")
          ) {
            window.history.replaceState({}, "", window.location.pathname);
          }

          return {
            session: data.session,
            user: data.user,
          };
        }

        // Fallback: Check for direct access token (implicit flow)
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

        if (access_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || "",
          });

          if (error) throw error;

          // Clean the URL after processing
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", window.location.pathname);
          }

          return {
            session: data.session,
            user: data.user,
          };
        }

        return { session: null };
      } else {
        // For mobile, use the existing QueryParams approach
        const { params, errorCode } = QueryParams.getQueryParams(url);

        if (errorCode) throw new Error(errorCode);

        const { access_token, refresh_token, code } = params;

        if (code) {
          // Exchange authorization code for session (PKCE flow)
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          return {
            session: data.session,
            user: data.user,
          };
        }

        if (access_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) throw error;
          return {
            session: data.session,
            user: data.user,
          };
        }

        return { session: null };
      }
    } catch (error) {
      console.error("Error creating session from URL:", error);
      return { error: error as Error };
    }
  }

  /**
   * Handle Google OAuth token exchange
   * This is used when we receive an authorization code from Google
   */
  async exchangeGoogleCode(code: string, codeVerifier?: string, baseUrl?: string): Promise<AuthResult> {
    try {
      // Create form data to send to our token endpoint
      const formData = new FormData();
      formData.append("code", code);

      // Add platform information for the backend to handle appropriately
      if (Platform.OS === "web") {
        formData.append("platform", "web");
      }

      // Add code verifier if provided
      if (codeVerifier) {
        formData.append("code_verifier", codeVerifier);
      }

      // Send the authorization code to our token endpoint
      const tokenResponse = await fetch(`${baseUrl}/api/auth/token`, {
        method: "POST",
        body: formData,
      });

      const userData = await tokenResponse.json();

      if (tokenResponse.ok && userData.access_token && userData.refresh_token) {
        // Set the session using the tokens from our backend
        const { data: sessionData, error: sessionError } = 
          await supabase.auth.setSession({
            access_token: userData.access_token,
            refresh_token: userData.refresh_token,
          });

        if (sessionError) {
          console.error("Error setting session:", sessionError);
          throw new Error(`Failed to set session: ${sessionError.message}`);
        } 
        
        if (!sessionData.session) {
          console.error("No session returned from setSession");
          throw new Error("Failed to create session");
        }
        
        return {
          session: sessionData.session,
          user: sessionData.user,
        };
      } else {
        console.error("Invalid response from token endpoint:", userData);
        throw new Error(userData.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Error exchanging Google code:", error);
      return { error: error as Error };
    }
  }
}

// Create and export a singleton instance
export const oauthService = new OAuthService();
export default oauthService;
