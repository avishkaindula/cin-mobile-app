import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants";

// Custom storage that works on both native and web
const customStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable automatic detection to handle manually
    flowType: "pkce", // Use PKCE for both platforms for consistency
  },
});

// Helper function to clear corrupted auth data
export const clearAuthData = async () => {
  try {
    await customStorage.removeItem("supabase.auth.token");
    await supabase.auth.signOut();
    console.log("Cleared corrupted auth data");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

// Helper function to handle auth errors
export const handleAuthError = async (error: any) => {
  if (error?.message?.includes("Invalid Refresh Token") || 
      error?.message?.includes("Refresh Token Not Found")) {
    console.log("Detected corrupted refresh token, clearing auth data...");
    await clearAuthData();
    return true; // Indicates we handled the error
  }
  return false; // Let the calling code handle other errors
};
