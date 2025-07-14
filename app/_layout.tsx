import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { PostHogProvider } from 'posthog-react-native';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { useSyncQueries } from 'tanstack-query-dev-tools-expo-plugin';

import '../components/sheets/Sheets';

import migrations from '../drizzle/migrations';
import * as schema from '../services/database/schema';

import '../global.css';
import { PushNotificationsInitializer } from '~/services/notifications/notifications';
import { POSTHOG_API_KEY, POSTHOG_CONFIG } from '~/services/analytics/posthog';

export const DATABASE_NAME = 'database.db';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle<typeof schema>(expoDb);
const queryClient = new QueryClient();

const AppContent = () => {
  const { success, error } = useMigrations(db, migrations);
  useSyncQueries({ queryClient });

  useEffect(() => {
    if (success) {
      console.log('✅ Database migrated successfully');
    } else if (error) {
      console.error('❌ Error migrating database:', error);
    }
  }, [success]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<ActivityIndicator size="small" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense>
          <GestureHandlerRootView>
            <NotifierWrapper useRNScreensOverlay>
              <SheetProvider>
                <PushNotificationsInitializer />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: 'white',
                    },
                    gestureEnabled: true,
                  }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                  <Stack.Screen
                    name="location_generic/[location]"
                    options={{
                      presentation: 'modal',
                      sheetGrabberVisible: true,
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="food/[food]"
                    options={{
                      presentation: 'modal',
                      sheetGrabberVisible: true,
                      headerShown: false,
                    }}
                  />

                  <Stack.Screen
                    name="favorites"
                    options={{
                      headerShown: false,
                    }}
                  />

                  <Stack.Screen
                    name="meal-plan"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="location/[location]"
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack>
              </SheetProvider>
            </NotifierWrapper>
          </GestureHandlerRootView>
        </SQLiteProvider>
      </Suspense>
    </QueryClientProvider>
  );
};

export default function Layout() {
  // If no PostHog API key is provided, render app without PostHog
  if (!POSTHOG_API_KEY) {
    return <AppContent />;
  }

  // If PostHog API key is provided, wrap app with PostHog provider
  return (
    <PostHogProvider
      apiKey={POSTHOG_CONFIG.apiKey}
      options={POSTHOG_CONFIG.options}
      autocapture={POSTHOG_CONFIG.autocapture}
      debug={POSTHOG_CONFIG.debug}>
      <AppContent />
    </PostHogProvider>
  );
}
