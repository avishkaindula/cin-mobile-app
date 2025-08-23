import {
  use,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { authService, oauthService } from "@/services";
import {
  makeRedirectUri,
  useAuthRequest,
  AuthRequestConfig,
  DiscoveryDocument,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { BASE_URL } from "@/lib/constants";
import { handleAuthError } from "@/lib/supabase";

// Required for web only
WebBrowser.maybeCompleteAuthSession();

// Utility function to check if URL contains auth parameters
const hasAuthParameters = (url: string): boolean => {
  return (
    url.includes("?code=") ||
    url.includes("#access_token=") ||
    url.includes("#error=") ||
    url.includes("?error=") ||
    url.includes("&code=") ||
    url.includes("&access_token=") ||
    url.includes("&error=") ||
    url.includes("refresh_token=") ||
    url.includes("token_type=")
  );
};

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
  signInWithApple: () => Promise<{ error?: any }>;
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
  isGoogleProcessing: boolean;
}>({
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  signUp: async () => ({ error: null }),
  signInWithGitHub: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signInWithApple: async () => ({ error: null }),
  sendMagicLink: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  resendVerification: async () => ({ error: null }),
  session: null,
  user: null,
  isLoading: true,
  isGoogleProcessing: false,
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
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);

  const redirectTo = makeRedirectUri();

  // Google OAuth setup
  const [googleRequest, googleResponse, promptGoogleAsync] = useAuthRequest(
    googleConfig,
    googleDiscovery
  );

  // Create session from URL for both web and mobile
  // Note: Returns null for URLs without auth parameters to avoid noise in logs
  const createSessionFromUrl = async (url: string) => {
    try {
      const { error, session } = await oauthService.createSessionFromUrl({ 
        url, 
        platform: Platform.OS as "web" | "mobile" 
      });
      
      if (error) {
        // Don't throw for missing auth parameters - this is normal for non-auth URLs
        if (error.message.includes("NO_AUTH_PARAMETERS") || error.message.includes("No valid auth parameters found in URL")) {
          return null;
        }
        throw error;
      }
      
      return session;
    } catch (error) {
      // Only log non-parameter errors to reduce noise
      if (error instanceof Error && !error.message.includes("NO_AUTH_PARAMETERS") && !error.message.includes("No valid auth parameters found in URL")) {
        console.error("Error creating session from URL:", error);
      }
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for auth tokens/codes in URL first (for email verification, OAuth, etc.)
        if (Platform.OS === "web" && typeof window !== "undefined") {
          const currentUrl = window.location.href;

          if (hasAuthParameters(currentUrl)) {
            try {
              const session = await createSessionFromUrl(currentUrl);
              if (session) {
                setSession(session);
                setIsLoading(false);
                return; // Early return if we successfully created a session
              }
            } catch (urlError) {
              // Only log URL processing errors if they're not about missing auth parameters
              // This prevents spam when navigating normally without auth parameters
              if (urlError instanceof Error && !urlError.message.includes("NO_AUTH_PARAMETERS") && !urlError.message.includes("No valid auth parameters found in URL")) {
                console.error("Error processing auth URL:", urlError);
              }
              // Continue to regular session check even if URL processing fails
            }
          }
        }

        // Get initial session
        const { session } = await authService.getCurrentSession();
        setSession(session || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        
        // Handle corrupted refresh token
        const handled = await handleAuthError(error);
        if (handled) {
          setSession(null);
        }
        
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((session: Session | null) => {
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
      // Only process URLs that likely contain auth parameters to avoid noise
      if (hasAuthParameters(url)) {
        createSessionFromUrl(url).catch((error) => {
          // Only log non-parameter errors
          if (error instanceof Error && !error.message.includes("NO_AUTH_PARAMETERS") && !error.message.includes("No valid auth parameters found in URL")) {
            console.error("Mobile deep link auth error:", error);
          }
        });
      }
    }
  }, [url]);

  // Handle Google OAuth response
  const handleGoogleResponse = async () => {
    // This function is called when Google redirects back to our app
    // The response contains the authorization code that we'll exchange for tokens
    if (googleResponse?.type === "success") {
      try {
        setIsGoogleProcessing(true);
        console.log("Starting Google OAuth token exchange...");
        
        // Extract the authorization code from the response
        const { code } = googleResponse.params;

        // Exchange the code for tokens using our OAuth service
        const { access_token, refresh_token, error: exchangeError } = 
          await oauthService.exchangeGoogleCode({
            code,
            codeVerifier: googleRequest?.codeVerifier,
            platform: Platform.OS as "web" | "mobile",
          });

        if (exchangeError) {
          console.error("Error exchanging Google code:", exchangeError);
          throw exchangeError;
        }

        if (access_token && refresh_token) {
          console.log("Setting session with received tokens...");
          // Set the session using the tokens from our backend
          const { error: sessionError, session: sessionData } = 
            await authService.setSession(access_token, refresh_token);

          if (sessionError) {
            console.error("Error setting session:", sessionError);
            throw new Error(`Failed to set session: ${sessionError.message}`);
          } 
          
          if (!sessionData) {
            console.error("No session returned from setSession");
            throw new Error("Failed to create session");
          }
          
          console.log("Google OAuth completed successfully:", sessionData.user?.email);
          setSession(sessionData);
          
          // The success message will be handled by the auth state change in the UI components
        } else {
          console.error("No tokens received from exchange");
          throw new Error("Authentication failed - no tokens received");
        }
      } catch (e) {
        console.error("Error handling auth response:", e);
        // Show user-friendly error
        if (Platform.OS === "web") {
          alert(`Authentication failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      } finally {
        setIsGoogleProcessing(false);
        setIsLoading(false);
      }
    } else if (googleResponse?.type === "cancel") {
      console.log("Google sign in cancelled");
      setIsGoogleProcessing(false);
      setIsLoading(false);
    } else if (googleResponse?.type === "error") {
      console.error("Google OAuth error:", googleResponse?.error);
      setIsGoogleProcessing(false);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn({ email, password });
    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();

      if (error) {
        console.error("Sign out error:", error);
        // If there's an error, still clear the local session
        setSession(null);
        return;
      }

      // Clear local session state
      setSession(null);

      // Web-specific cleanup - handled by authService
      if (Platform.OS === "web" && typeof window !== "undefined") {
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
    const { error, session } = await authService.signUp({ 
      email, 
      password, 
      fullName 
    });
    return { error, session };
  };

  const signInWithGitHub = async () => {
    try {
      return await oauthService.signInWithGitHub(redirectTo);
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

  const signInWithApple = async () => {
    try {
      return await oauthService.signInWithApple();
    } catch (error) {
      return { error };
    }
  };

  const sendMagicLink = async (email: string) => {
    const { error } = await authService.sendMagicLink({ 
      email, 
      redirectTo 
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword({ email });
    return { error };
  };

  const verifyOtp = async (
    email: string,
    token: string,
    type: "signup" | "recovery" | "email_change"
  ) => {
    const { error, session } = await authService.verifyOtp({
      email,
      token,
      type,
    });
    return { error, session };
  };

  const resendVerification = async (email: string) => {
    const { error } = await authService.resendVerification({
      email,
      type: "signup",
      redirectTo,
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
        signInWithApple,
        sendMagicLink,
        resetPassword,
        verifyOtp,
        resendVerification,
        session,
        user: session?.user || null,
        isLoading,
        isGoogleProcessing,
      }}
    >
      {children}
    </AuthContext>
  );
}
