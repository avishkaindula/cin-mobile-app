import { use, createContext, type PropsWithChildren, useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

// Required for web only
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error?: any; session?: Session | null }>;
  signInWithGitHub: () => Promise<{ error?: any }>;
  sendMagicLink: (email: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  session: Session | null;
  user: Session['user'] | null;
  isLoading: boolean;
}>({
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  signUp: async () => ({ error: null }),
  signInWithGitHub: async () => ({ error: null }),
  sendMagicLink: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
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

  // Create session from URL for deep linking
  const createSessionFromUrl = async (url: string) => {
    try {
      const { params, errorCode } = QueryParams.getQueryParams(url);
      
      if (errorCode) throw new Error(errorCode);
      
      const { access_token, refresh_token } = params;
      
      if (!access_token) return;
      
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      
      if (error) throw error;
      
      return data.session;
    } catch (error) {
      console.error('Error creating session from URL:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle linking into app from email/OAuth
  const url = Linking.useURL();
  useEffect(() => {
    if (url && Platform.OS !== 'web') {
      createSessionFromUrl(url).catch(console.error);
    }
  }, [url]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string) => {
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    return { error, session };
  };

  const signInWithGitHub = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, use standard OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: window.location.origin,
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

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'com.climateintelligencedemo://reset-password',
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
        sendMagicLink,
        resetPassword,
        session,
        user: session?.user || null,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
