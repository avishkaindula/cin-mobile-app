import { Stack } from 'expo-router';

export default function MissionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="submit" />
    </Stack>
  );
}
