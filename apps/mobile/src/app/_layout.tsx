// ─── Root Layout ─────────────────────────────────────────────────────
// App entry: loads fonts, initializes DB, sets up notification listeners.

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { useDatabase } from '@/hooks/useDatabase';
import { useNotifications } from '@/hooks/useNotifications';
import { colors } from '@zenth/utils';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/tokenCache';
import { SignInScreen } from '@/components/SignInScreen';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;


// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isReady } = useDatabase();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
  });

  // Set up notification deep-link handler
  useNotifications();

  useEffect(() => {
    if (isReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isReady, fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <SignedIn>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInScreen />
      </SignedOut>
    </ClerkProvider>
  );
}
