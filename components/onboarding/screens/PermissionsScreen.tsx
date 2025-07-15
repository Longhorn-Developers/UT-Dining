import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, AppState } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

interface PermissionState {
  location: PermissionStatus;
  notifications: PermissionStatus;
}

const PermissionsScreen = ({ width }: Props) => {
  const [permissions, setPermissions] = useState<PermissionState>({
    location: 'undetermined',
    notifications: 'undetermined',
  });

  useEffect(() => {
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
  }, []);

  const checkPermissions = async () => {
    try {
      // Check current permission status without requesting
      const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
      const { status: notificationStatus } = await Notifications.getPermissionsAsync();

      setPermissions({
        location: locationStatus === 'granted' ? 'granted' : 'denied',
        notifications: notificationStatus === 'granted' ? 'granted' : 'denied',
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      // Request notification permission
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();

      setPermissions({
        location: locationStatus === 'granted' ? 'granted' : 'denied',
        notifications: notificationStatus === 'granted' ? 'granted' : 'denied',
      });
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const openSettings = () => {
    Alert.alert('Open Settings', 'To enable permissions, please go to your device settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };

  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 text-center text-3xl font-bold text-gray-900">
          Enable Permissions
        </Text>
        <Text className="mb-8 text-center text-lg text-gray-600">
          Allow these permissions to get the best experience from UT Dining
        </Text>

        <View className="mb-8 w-full space-y-6">
          {/* Location Permission */}
          <TouchableOpacity
            onPress={permissions.location === 'denied' ? openSettings : undefined}
            className="rounded-2xl border border-gray-200 bg-white p-6">
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-ut-burnt-orange/10">
                <Ionicons name="location" size={24} color={COLORS['ut-burnt-orange']} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">Location Services</Text>
                <Text className="text-sm text-gray-600">
                  Find nearby dining halls and get personalized recommendations
                </Text>
              </View>
              <Ionicons
                name={permissions.location === 'granted' ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={permissions.location === 'granted' ? '#10B981' : COLORS['ut-grey']}
              />
            </View>
          </TouchableOpacity>

          {/* Notification Permission */}
          <TouchableOpacity
            onPress={permissions.notifications === 'denied' ? openSettings : undefined}
            className="rounded-2xl border border-gray-200 bg-white p-6">
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-ut-burnt-orange/10">
                <Ionicons name="notifications" size={24} color={COLORS['ut-burnt-orange']} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">Push Notifications</Text>
                <Text className="text-sm text-gray-600">
                  Get notified when your favorite meals are available
                </Text>
              </View>
              <Ionicons
                name={
                  permissions.notifications === 'granted' ? 'checkmark-circle' : 'ellipse-outline'
                }
                size={24}
                color={permissions.notifications === 'granted' ? '#10B981' : COLORS['ut-grey']}
              />
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-sm text-gray-500">
          These settings can be changed anytime in the settings page.
        </Text>
      </View>
    </View>
  );
};

export default PermissionsScreen;
