import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
        },
        gestureEnabled: true,
      }}>
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
  );
}
