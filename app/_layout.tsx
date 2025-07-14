import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { LanguageProvider } from "@/components/i18n/LanguageContext";

import "../global.css";
import { SessionProvider, useSession } from "@/context/auth";
import { SplashScreenController } from "@/components/SplashController";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <SessionProvider>
      <LanguageProvider>
        <GluestackUIProvider>
          <SplashScreenController />
          <RootLayoutNav />
        </GluestackUIProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

function RootLayoutNav() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Reset password should be accessible regardless of session state */}
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
