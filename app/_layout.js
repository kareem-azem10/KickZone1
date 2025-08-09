import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Redirect entry will send to /(tabs) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Register the tabs segment so it can render the bottom tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Phone login screen */}
        <Stack.Screen name="Login" options={{ headerShown: true, title: 'تسجيل الدخول' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
