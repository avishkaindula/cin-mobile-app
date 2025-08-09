import { Session, User, AuthError } from "@supabase/supabase-js";

// Base response interface for all auth operations
export interface AuthResponse {
  error?: AuthError | Error | null;
}

// Sign in interfaces
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse extends AuthResponse {
  session?: Session | null;
  user?: User | null;
}

// Sign up interfaces
export interface SignUpRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignUpResponse extends AuthResponse {
  session?: Session | null;
  user?: User | null;
  needsVerification?: boolean;
}

// Password reset interfaces
export interface ResetPasswordRequest {
  email: string;
  redirectTo?: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

// OTP verification interfaces
export interface VerifyOtpRequest {
  email: string;
  token: string;
  type: "signup" | "recovery" | "email_change" | "magiclink";
}

export interface VerifyOtpResponse extends AuthResponse {
  session?: Session | null;
  user?: User | null;
}

// Magic link interfaces
export interface MagicLinkRequest {
  email: string;
  redirectTo?: string;
}

// OAuth interfaces
export interface OAuthProvider {
  provider: "github" | "google";
  redirectTo?: string;
}

export interface OAuthResponse extends AuthResponse {
  url?: string;
  needsRedirect?: boolean;
}

// Session interfaces
export interface SessionResponse extends AuthResponse {
  session?: Session | null;
  user?: User | null;
}

// Resend verification interfaces
export interface ResendVerificationRequest {
  email: string;
  type?: "signup" | "email_change";
  redirectTo?: string;
}

// Google OAuth specific types
export interface GoogleTokenExchangeRequest {
  code: string;
  codeVerifier?: string;
  platform?: "web" | "mobile";
}

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token: string;
  error?: string;
}

// Auth session creation from URL
export interface CreateSessionFromUrlRequest {
  url: string;
  platform?: "web" | "mobile";
}
