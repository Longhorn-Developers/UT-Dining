import { Stack } from 'expo-router';
import { SheetProvider } from 'react-native-actions-sheet';
import '../components/sheets/Sheets';
import '../global.css';

export default function Layout() {
  return (
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
  );
}
