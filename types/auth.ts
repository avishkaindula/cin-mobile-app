import { Session, User, AuthError } from "@supabase/supabase-js";

export interface AuthResult {
  error?: AuthError | Error | null;
  session?: Session | null;
  user?: User | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface OTPVerification {
  email: string;
  token: string;
  type: "signup" | "recovery" | "email_change";
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  password: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface OAuthOptions {
  redirectTo?: string;
  skipBrowserRedirect?: boolean;
}

export interface SessionData {
  access_token: string;
  refresh_token: string;
}

export interface AuthContextType {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signInWithGitHub: () => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  sendMagicLink: (email: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  verifyOtp: (email: string, token: string, type: "signup" | "recovery" | "email_change") => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isGoogleProcessing: boolean;
}
