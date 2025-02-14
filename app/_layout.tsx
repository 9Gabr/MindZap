import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(games)/quickmath" />
        <Stack.Screen name="(games)/simon" />
        <Stack.Screen name="(games)/wordle" />
        <Stack.Screen name="(games)/memory" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
