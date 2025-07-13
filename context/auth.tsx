import {
  use,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { authService, oauthService } from "@/services";
import { AuthContextType } from "@/types";
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

const AuthContext = createContext<AuthContextType>({
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
  const createSessionFromUrl = async (url: string) => {
    return await oauthService.createSessionFromUrl(url);
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
            const sessionResult = await createSessionFromUrl(currentUrl);
            if (sessionResult.session) {
              setSession(sessionResult.session);
              setIsLoading(false);
              return; // Early return if we successfully created a session
            }
          }
        }

        // Get initial session
        const { session, error } = await authService.getCurrentSession();
        if (error) {
          console.error("Error getting session:", error);
        }

        setSession(session);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event: string, session: Session | null) => {
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
        setIsGoogleProcessing(true);
        console.log("Starting Google OAuth token exchange...");
        
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
        // Then create a Supabase session and return the tokens
        console.log("Exchanging code for tokens...");
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
          method: "POST",
          body: formData,
        });

        const userData = await tokenResponse.json();
        console.log("Token exchange response received");

        if (tokenResponse.ok && userData.access_token && userData.refresh_token) {
          console.log("Setting session with received tokens...");
          // Set the session using the tokens from our backend
          const sessionResult = await authService.setSession({
            access_token: userData.access_token,
            refresh_token: userData.refresh_token,
          });

          if (sessionResult.error) {
            console.error("Error setting session:", sessionResult.error);
            throw new Error(`Failed to set session: ${sessionResult.error.message}`);
          } 
          
          if (!sessionResult.session) {
            console.error("No session returned from setSession");
            throw new Error("Failed to create session");
          }
          
          console.log("Google OAuth completed successfully:", sessionResult.user?.email);
          setSession(sessionResult.session);
          
          // The success message will be handled by the auth state change in the UI components
        } else {
          console.error("Invalid response from token endpoint:", userData);
          throw new Error(userData.error || "Authentication failed");
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
    return await authService.signIn({ email, password });
  };

  const signOut = async () => {
    try {
      const result = await authService.signOut();
      
      if (result.error) {
        console.error("Sign out error:", result.error);
        // If there's an error, still clear the local session
        setSession(null);
        return;
      }

      // Clear local session state
      setSession(null);

      // Web-specific cleanup
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
    const redirectToUrl = Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin
      : redirectTo;
    
    return await authService.signUp({ email, password, fullName }, redirectToUrl);
  };

  const signInWithGitHub = async () => {
    const redirectToUrl = Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin
      : redirectTo;
      
    return await oauthService.signInWithGitHub({ 
      redirectTo: redirectToUrl,
      skipBrowserRedirect: Platform.OS !== "web"
    });
  };

  const signInWithGoogle = async () => {
    try {
      if (!googleRequest) {
        return { error: new Error("Google request not initialized") };
      }
      await promptGoogleAsync();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const sendMagicLink = async (email: string) => {
    const redirectToUrl = Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin
      : redirectTo;
      
    return await authService.sendMagicLink({ email }, redirectToUrl);
  };

  const resetPassword = async (email: string) => {
    const redirectToUrl = Platform.OS === "web" && typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : "com.climateintelligencedemo://reset-password";
      
    return await authService.resetPassword({ email }, redirectToUrl);
  };

  const verifyOtp = async (
    email: string,
    token: string,
    type: "signup" | "recovery" | "email_change"
  ) => {
    return await authService.verifyOtp({ email, token, type });
  };

  const resendVerification = async (email: string) => {
    const redirectToUrl = Platform.OS === "web" && typeof window !== "undefined"
      ? window.location.origin
      : redirectTo;
      
    return await authService.resendVerification({ email }, redirectToUrl);
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
        isGoogleProcessing,
      }}
    >
      {children}
    </AuthContext>
  );
}
