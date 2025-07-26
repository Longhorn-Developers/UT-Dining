import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Bell, Check, MapPin, XIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Linking,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
  onPermissionsChange: (permissions: PermissionState) => void;
};

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

interface PermissionState {
  location: PermissionStatus;
  notifications: PermissionStatus;
}

const PermissionsScreen = ({ width, onPermissionsChange }: Props) => {
  const [permissions, setPermissions] = useState<PermissionState>({
    location: 'undetermined',
    notifications: 'undetermined',
  });
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Request location permission
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

        // Request notification permission
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();

        const newPermissions = {
          location: locationStatus === 'granted' ? 'granted' : 'denied',
          notifications: notificationStatus === 'granted' ? 'granted' : 'denied',
        } as PermissionState;

        setPermissions(newPermissions);
        onPermissionsChange(newPermissions);
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    const checkPermissions = async () => {
      try {
        // Check current permission status without requesting
        const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
        const { status: notificationStatus } = await Notifications.getPermissionsAsync();

        const newPermissions = {
          location: locationStatus === 'granted' ? 'granted' : 'denied',
          notifications: notificationStatus === 'granted' ? 'granted' : 'denied',
        } as PermissionState;

        setPermissions(newPermissions);
        onPermissionsChange(newPermissions);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };

    requestPermissions();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Check permissions when app becomes active (user returns from settings)
        checkPermissions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [onPermissionsChange]);

  const openSettings = () => {
    Alert.alert('Open Settings', 'To enable permissions, please go to your device settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };

  return (
    <View style={{ width }} className={cn('flex-1 px-6', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="flex-1 items-center justify-center">
        <Text
          className={cn(
            'mb-1 text-center font-bold text-3xl',
            isDark ? 'text-white' : 'text-gray-900',
          )}
        >
          Enable Permissions
        </Text>
        <Text
          className={cn(
            'mb-4 max-w-[250px] text-center text-lg leading-6',
            isDark ? 'text-gray-300' : 'text-gray-600',
          )}
        >
          We just need a few permissions to make your experience better
        </Text>

        <View className="w-full space-y-6">
          {/* Location Permission */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={permissions.location === 'denied' ? openSettings : undefined}
            className={cn(
              'mb-2 rounded-2xl  p-6',
              isDark ? ' bg-gray-800' : 'border border-gray-200 bg-white',
            )}
          >
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-ut-burnt-orange/10">
                <MapPin size={24} color={COLORS['ut-burnt-orange']} />
              </View>
              <View className="flex-1">
                <Text
                  className={cn('font-semibold text-lg', isDark ? 'text-white' : 'text-gray-900')}
                >
                  Location Services
                </Text>
                <Text className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
                  See your location on the interactive campus map
                </Text>
              </View>
              {permissions.location === 'granted' ? (
                <Check size={24} color={isDark ? '#22c55e' : 'green'} />
              ) : (
                <XIcon size={24} color={isDark ? '#ef4444' : 'red'} />
              )}
            </View>
          </TouchableOpacity>

          {/* Notification Permission */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openSettings}
            className={cn(
              'rounded-2xl  p-6',
              isDark ? ' bg-gray-800' : 'border border-gray-200 bg-white',
            )}
          >
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-ut-burnt-orange/10">
                <Bell size={24} color={COLORS['ut-burnt-orange']} />
              </View>
              <View className="flex-1">
                <Text
                  className={cn('font-semibold text-lg', isDark ? 'text-white' : 'text-gray-900')}
                >
                  Push Notifications
                </Text>
                <Text
                  className={cn(
                    'max-w-[200px] text-sm',
                    isDark ? 'text-gray-300' : 'text-gray-600',
                  )}
                >
                  Get notified for menu updates, hours changes, and more
                </Text>
              </View>

              {permissions.notifications === 'granted' ? (
                <Check size={24} color={isDark ? '#22c55e' : 'green'} />
              ) : (
                <XIcon size={24} color={isDark ? '#ef4444' : 'red'} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text
          className={cn(
            'absolute bottom-0 max-w-[260px] text-center text-sm',
            isDark ? 'text-gray-400' : 'text-gray-500',
          )}
        >
          These settings are completely optional and can be changed at any time.
        </Text>
      </View>
    </View>
  );
};

export default PermissionsScreen;
