import { Stack } from 'expo-router';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';

import '../components/sheets/Sheets';
import '../global.css';

export default function Layout() {
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
            }}
          />
        </SheetProvider>
      </NotifierWrapper>
    </GestureHandlerRootView>
  );
}
