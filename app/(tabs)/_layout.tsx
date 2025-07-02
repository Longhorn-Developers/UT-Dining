import { Tabs } from 'expo-router';
import { Home, MapPin } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const isColorBlindMode = useSettingsStore((state) => state.isColorBlindMode);

  // Use manual dark mode setting if available, otherwise fall back to system
  const isDark = isDarkMode ?? colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 20,
          paddingTop: 8,
          shadowColor: isDark ? '#000000' : '#000000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarActiveTintColor: isColorBlindMode ? COLORS['ut-burnt-orange'] : '#BF5700',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size, focused }) => (
            <MapPin size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
