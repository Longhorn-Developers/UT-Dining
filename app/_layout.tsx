import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import * as schema from '../db/schema';
import migrations from '../drizzle/migrations';

import '../components/sheets/Sheets';
import '../global.css';

export const DATABASE_NAME = 'database.db';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function Layout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle<typeof schema>(expoDb);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      console.log('Database migrated successfully');
    } else if (error) {
      console.error('Error migrating database:', error);
    }
  }, [success]);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense>
        <GestureHandlerRootView>
          <NotifierWrapper>
            <SheetProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: 'white',
                  },
                  gestureEnabled: true,
                }}
              />
            </SheetProvider>
          </NotifierWrapper>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
