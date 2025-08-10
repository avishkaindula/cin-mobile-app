import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="mission/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="mission/[id]/submit" options={{ headerShown: false }} />
    </Stack>
  );
}
