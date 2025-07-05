import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { getOrCreateDeviceId } from '~/services/device/deviceId';
import { usePushNotificationsStore } from '~/store/usePushNotificationsStore';
import { supabase } from '~/utils/supabase';

// Global handler (still needed)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});

export function PushNotificationsInitializer() {
  const setDeviceId = usePushNotificationsStore((s) => s.setDeviceId);
  const setExpoPushToken = usePushNotificationsStore((s) => s.setExpoPushToken);
  const setNotification = usePushNotificationsStore((s) => s.setNotification);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    setDeviceId(deviceId);

    async function registerAndSync() {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (!Device.isDevice) {
        alert('Must use physical device for push notifications.');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Permission not granted for push notifications!');
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (!projectId) {
        alert('Project ID not found.');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      setExpoPushToken(token);

      // Sync to Supabase
      const { data } = await supabase
        .from('user_devices')
        .select('push_token')
        .eq('device_id', deviceId)
        .single();

      if (!data) {
        const { error } = await supabase.from('user_devices').insert({
          device_id: deviceId,
          push_token: token,
          updated_at: new Date().toISOString(),
        });
        if (error) console.error('❌ Error inserting push token:', error);
        else console.log('✅ Push token registered:', token);
      } else if (data.push_token !== token) {
        const { error } = await supabase.from('user_devices').upsert({
          device_id: deviceId,
          push_token: token,
          updated_at: new Date().toISOString(),
        });
        if (error) console.error('❌ Error updating push token:', error);
        else console.log('✅ Push token updated:', token);
      } else {
        console.log('✅ Push token already synced.');
      }
    }

    registerAndSync();

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotification(response.notification);
      console.log('Notification response:', response.notification.request.content);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
      console.log('✅ Push notification listeners cleaned up.');
    };
  }, [setDeviceId, setExpoPushToken, setNotification]);

  return null;
}
