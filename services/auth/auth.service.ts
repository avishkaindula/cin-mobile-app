import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import { 
  SignInRequest, 
  SignInResponse, 
  SignUpRequest, 
  SignUpResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  MagicLinkRequest,
  SessionResponse,
  ResendVerificationRequest,
  AuthResponse
} from "@/types/auth";

/**
 * AuthService - Core authentication operations
 * 
 * This service encapsulates all Supabase authentication operations
 * providing a clean interface for the frontend to interact with.
 */
export class AuthService {
  private static instance: AuthService;

  // Singleton pattern to ensure one instance
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInRequest): Promise<SignInResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
  async signUp({ email, password, fullName }: SignUpRequest): Promise<SignUpResponse> {
    try {
      const redirectTo = this.getRedirectUrl();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName || "",
          },
        },
      });

      return {
        error,
        session: data.session,
        user: data.user,
        needsVerification: !data.session, // If no session, user needs to verify email
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      // Use scope: 'local' for web to avoid the 403 error
      const { error } = await supabase.auth.signOut({
        scope: Platform.OS === "web" ? "local" : "global",
      });

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
      }

      return { error };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Get the current session
   */
  async getCurrentSession(): Promise<SessionResponse> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      return {
        error,
        session: data.session,
        user: data.session?.user || null,
      };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Send magic link for passwordless authentication
   */
  async sendMagicLink({ email, redirectTo }: MagicLinkRequest): Promise<AuthResponse> {
    try {
      const finalRedirectTo = redirectTo || this.getRedirectUrl();
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: finalRedirectTo,
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
   * Send password reset email
   */
  async resetPassword({ email, redirectTo }: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const finalRedirectTo = redirectTo || this.getResetPasswordUrl();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: finalRedirectTo,
      });

      return { error };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Update user password (requires current session)
   */
  async updatePassword({ password }: UpdatePasswordRequest): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      return { error };
    } catch (error) {
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Verify OTP token
   */
  async verifyOtp({ email, token, type }: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
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
   * Resend verification email
   */
  async resendVerification({ 
    email, 
    type = "signup", 
    redirectTo 
  }: ResendVerificationRequest): Promise<AuthResponse> {
    try {
      const finalRedirectTo = redirectTo || this.getRedirectUrl();
      
      const { error } = await supabase.auth.resend({
        type: type as "signup" | "email_change",
        email,
        options: {
          emailRedirectTo: finalRedirectTo,
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
   * Exchange authorization code for session (PKCE flow)
   */
  async exchangeCodeForSession(code: string): Promise<SessionResponse> {
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
   * Set session using access and refresh tokens
   */
  async setSession(accessToken: string, refreshToken: string): Promise<SessionResponse> {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
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
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  // Private helper methods
  private getRedirectUrl(): string {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.location.origin;
    }
    // For mobile, you would use your deep link URL
    return "com.climateintelligencedemo://";
  }

  private getResetPasswordUrl(): string {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return `${window.location.origin}/reset-password`;
    }
    return "com.climateintelligencedemo://reset-password";
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
