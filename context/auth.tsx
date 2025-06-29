import {
  use,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  makeRedirectUri,
  useAuthRequest,
  AuthRequestConfig,
  DiscoveryDocument,
} from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { BASE_URL } from "@/lib/constants";

// Required for web only
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const googleConfig: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const googleDiscovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error?: any; session?: Session | null }>;
  signInWithGitHub: () => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  sendMagicLink: (email: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  verifyOtp: (
    email: string,
    token: string,
    type: "signup" | "recovery" | "email_change"
  ) => Promise<{ error?: any; session?: Session | null }>;
  resendVerification: (email: string) => Promise<{ error?: any }>;
  session: Session | null;
  user: Session["user"] | null;
  isLoading: boolean;
}>({
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  signUp: async () => ({ error: null }),
  signInWithGitHub: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  sendMagicLink: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  resendVerification: async () => ({ error: null }),
  session: null,
  user: null,
  isLoading: true,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirectTo = makeRedirectUri();

  // Google OAuth setup
  const [googleRequest, googleResponse, promptGoogleAsync] = useAuthRequest(
    googleConfig,
    googleDiscovery
  );

  // Create session from URL for both web and mobile
  const createSessionFromUrl = async (url: string) => {
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
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

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

          return data.session;
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

          return data.session;
        }

        return null;
      } else {
        // For mobile, use the existing QueryParams approach
        const { params, errorCode } = QueryParams.getQueryParams(url);

        if (errorCode) throw new Error(errorCode);

        const { access_token, refresh_token, code } = params;

        if (code) {
          // Exchange authorization code for session (PKCE flow)
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );
          if (error) throw error;
          return data.session;
        }

        if (access_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) throw error;
          return data.session;
        }

        return null;
      }
    } catch (error) {
      console.error("Error creating session from URL:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for auth tokens/codes in URL first (for email verification, OAuth, etc.)
        if (Platform.OS === "web" && typeof window !== "undefined") {
          const currentUrl = window.location.href;

          if (
            currentUrl.includes("?code=") ||
            currentUrl.includes("#access_token=") ||
            currentUrl.includes("#error=") ||
            currentUrl.includes("?error=")
          ) {
            const session = await createSessionFromUrl(currentUrl);
            if (session) {
              setSession(session);
              setIsLoading(false);
              return; // Early return if we successfully created a session
            }
          }
        }

        // Get initial session

        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Google OAuth response
  useEffect(() => {
    handleGoogleResponse();
  }, [googleResponse]);

  // Handle linking into app from email/OAuth (mobile only)
  const url = Linking.useURL();
  useEffect(() => {
    if (url && Platform.OS !== "web") {
      createSessionFromUrl(url).catch(console.error);
    }
  }, [url]);

  // Handle Google OAuth response
  const handleGoogleResponse = async () => {
    // This function is called when Google redirects back to our app
    // The response contains the authorization code that we'll exchange for tokens
    if (googleResponse?.type === "success") {
      try {
        setIsLoading(true);
        // Extract the authorization code from the response
        // This code is what we'll exchange for access and refresh tokens
        const { code } = googleResponse.params;

        // Create form data to send to our token endpoint
        // We include both the code and platform information
        // The platform info helps our server handle web vs native differently
        const formData = new FormData();
        formData.append("code", code);

        // Add platform information for the backend to handle appropriately
        if (Platform.OS === "web") {
          formData.append("platform", "web");
        }

        // Get the code verifier from the request object
        // This is the same verifier that was used to generate the code challenge
        if (googleRequest?.codeVerifier) {
          formData.append("code_verifier", googleRequest.codeVerifier);
        } else {
          console.warn("No code verifier found in request object");
        }

        // Send the authorization code to our token endpoint
        // The server will exchange this code with Google for access and refresh tokens
        // For web: credentials are included to handle cookies
        // For native: we'll receive the tokens directly in the response
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
          method: "POST",
          body: formData,
        });

        // For web: The server sets the tokens in HTTP-only cookies
        // We just need to get the user data from the response
        const userData = await tokenResponse.json();

        console.log("Google OAuth user data:", userData);
      } catch (e) {
        console.error("Error handling auth response:", e);
      } finally {
        setIsLoading(false);
      }
    } else if (googleResponse?.type === "cancel") {
      alert("Sign in cancelled");
    } else if (googleResponse?.type === "error") {
      console.error("Google OAuth error:", googleResponse?.error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Use scope: 'local' for web to avoid the 403 error
      const { error } = await supabase.auth.signOut({
        scope: Platform.OS === "web" ? "local" : "global",
      });

      if (error) {
        console.error("Sign out error:", error);
        // If there's an error, still clear the local session
        setSession(null);
        return;
      }

      // Clear local session state
      setSession(null);

      // Web-specific cleanup
      if (Platform.OS === "web" && typeof window !== "undefined") {
        // Clear any remaining localStorage items
        try {
          const keys = Object.keys(localStorage);
          keys.forEach((key) => {
            if (key.includes("supabase") || key.includes("auth")) {
              localStorage.removeItem(key);
            }
          });
        } catch (storageError) {
          console.warn("Error clearing localStorage:", storageError);
        }

        // Force a page refresh to ensure clean state
        window.location.reload();
      }
    } catch (error) {
      console.error("Sign out failed:", error);
      // Even if sign out fails, clear local state
      setSession(null);

      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          Platform.OS === "web" && typeof window !== "undefined"
            ? window.location.origin
            : redirectTo,
        data: {
          full_name: fullName || "",
        },
      },
    });
    return { error, session };
  };

  const signInWithGitHub = async () => {
    try {
      if (Platform.OS === "web") {
        // For web, use standard OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo:
              typeof window !== "undefined"
                ? window.location.origin
                : undefined,
          },
        });
        return { error };
      } else {
        // For mobile, use deep linking flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        const res = await WebBrowser.openAuthSessionAsync(
          data?.url ?? "",
          redirectTo
        );

        if (res.type === "success") {
          const { url } = res;
          await createSessionFromUrl(url);
          return { error: null };
        }

        return { error: new Error("OAuth cancelled") };
      }
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!googleRequest) {
        return { error: new Error("Google request not initialized") };
      }
      await promptGoogleAsync();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          Platform.OS === "web" && typeof window !== "undefined"
            ? window.location.origin
            : redirectTo,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        Platform.OS === "web" && typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "com.climateintelligencedemo://reset-password",
    });
    return { error };
  };

  const verifyOtp = async (
    email: string,
    token: string,
    type: "signup" | "recovery" | "email_change"
  ) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    return { error, session: data.session };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo:
          Platform.OS === "web" && typeof window !== "undefined"
            ? window.location.origin
            : redirectTo,
      },
    });
    return { error };
  };

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        signUp,
        signInWithGitHub,
        signInWithGoogle,
        sendMagicLink,
        resetPassword,
        verifyOtp,
        resendVerification,
        session,
        user: session?.user || null,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
