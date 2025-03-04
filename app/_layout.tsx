import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';

import '../components/sheets/Sheets';
import '../global.css';
import { STORAGE_KEY_FAVORITES, STORAGE_KEY_MEALPLAN, useDataStore } from '~/store/useDataStore';

export default function Layout() {
  const favoriteFoodItems = useDataStore((state) => state.favoriteFoodItems);
  const mealPlanItems = useDataStore((state) => state.mealPlanItems);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        console.log('Closing app...');
        // Batch write without blocking the event loop
        AsyncStorage.multiSet([
          [STORAGE_KEY_FAVORITES, JSON.stringify(favoriteFoodItems)],
          [STORAGE_KEY_MEALPLAN, JSON.stringify(mealPlanItems)],
        ]).catch((error) => console.error('Error saving state in background:', error));
      }
    });
    return () => subscription.remove();
  }, [favoriteFoodItems, mealPlanItems]);

  return (
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
  );
}
