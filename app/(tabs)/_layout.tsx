import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { Bell, Cog, Home, MapPin } from 'lucide-react-native';

import { useUnreadNotifications } from '~/hooks/useUnreadNotifications';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';

export default function Layout() {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { unreadCount, hasUnread } = useUnreadNotifications();

  const handleTabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#171717' : '#ffffff',
          borderTopColor: isDarkMode ? '#262626' : '#e5e7eb',
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: COLORS['ut-burnt-orange'],
        tabBarInactiveTintColor: isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey'],
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 1,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={1.2} />,
          tabBarActiveBackgroundColor: 'rgba(191, 87, 0, 0.05)',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} strokeWidth={1.2} />,
          tabBarActiveBackgroundColor: 'rgba(191, 87, 0, 0.05)',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} strokeWidth={1.2} />,
          tabBarActiveBackgroundColor: 'rgba(191, 87, 0, 0.05)',
          tabBarBadge: hasUnread ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS['ut-burnt-orange'],
            color: 'white',
          },
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Cog size={size} color={color} strokeWidth={1.2} />,
          tabBarActiveBackgroundColor: 'rgba(191, 87, 0, 0.05)',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
    </Tabs>
  );
}
