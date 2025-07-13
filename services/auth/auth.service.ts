import { supabase } from "@/lib/supabase";
import { 
  AuthResult, 
  SignInCredentials, 
  SignUpCredentials, 
  OTPVerification, 
  PasswordResetRequest,
  PasswordUpdateRequest,
  MagicLinkRequest,
  ResendVerificationRequest,
  OAuthOptions,
  SessionData
} from "@/types/auth";
import { Platform } from "react-native";

/**
 * Authentication Service
 * 
 * This service encapsulates all Supabase authentication operations,
 * providing a clean API for frontend components to use without
 * directly importing or calling Supabase methods.
 */
class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      return {
        error,
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials, redirectTo?: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: credentials.fullName || "",
          },
        },
      });

      return {
        error,
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ error?: Error }> {
    try {
      const { error } = await supabase.auth.signOut({
        scope: Platform.OS === "web" ? "local" : "global",
      });

      if (error) {
        console.error("Sign out error:", error);
        return { error };
      }

      // Web-specific cleanup
      if (Platform.OS === "web" && typeof window !== "undefined") {
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
      }

      return {};
    } catch (error) {
      console.error("Sign out failed:", error);
      return { error: error as Error };
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error: error as Error };
    }
  }

  /**
   * Send magic link for passwordless authentication
   */
  async sendMagicLink(request: MagicLinkRequest, redirectTo?: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: request.email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      return { error };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Reset password via email
   */
  async resetPassword(request: PasswordResetRequest, redirectTo?: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
        redirectTo,
      });

      return { error };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Update user password (requires authenticated session)
   */
  async updatePassword(request: PasswordUpdateRequest): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: request.password,
      });

      return {
        error,
        user: data.user,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Verify OTP (One-Time Password)
   */
  async verifyOtp(verification: OTPVerification): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: verification.email,
        token: verification.token,
        type: verification.type,
      });

      return {
        error,
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Resend email verification
   */
  async resendVerification(request: ResendVerificationRequest, redirectTo?: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: request.email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      return { error };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Set session from tokens
   */
  async setSession(sessionData: SessionData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
      });

      return {
        error,
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Exchange authorization code for session (PKCE flow)
   */
  async exchangeCodeForSession(code: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      return {
        error,
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;
