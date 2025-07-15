import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { insertNotification } from '../database/database';

import { useDatabase } from '~/hooks/useDatabase';
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
  const db = useDatabase();

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
        if (__DEV__) {
          alert('Permission not granted for push notifications! (DEV)');
        }
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (!projectId) {
        if (__DEV__) {
          alert('Project ID not found. (DEV)');
        }
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

      // If the device is not in the database, insert it
      if (!data) {
        const { error } = await supabase.from('user_devices').insert({
          device_id: deviceId,
          push_token: token,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('❌ Error inserting push token:', error);
        } else {
          console.log('✅ Push token registered:', token);
        }
      } else if (data.push_token !== token) {
        // If the push token is different, update it
        const { error } = await supabase.from('user_devices').upsert({
          device_id: deviceId,
          push_token: token,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('❌ Error updating push token:', error);
        } else {
          console.log('✅ Push token updated:', token);
        }
      } else {
        console.log('✅ Push token already synced.');
      }
    }

    registerAndSync();

    // Triggered when the app is in the foreground (when the app is open)
    const notificationListener = Notifications.addNotificationReceivedListener(
      async (notification) => {
        console.log('📱 Notification foreground received:', JSON.stringify(notification, null, 2));
        setNotification(notification);

        if (db) {
          try {
            await insertNotification(db, {
              id: notification.request.identifier,
              title: notification.request.content.title ?? 'Notification',
              body: notification.request.content.body ?? '',
              sent_at: new Date().toISOString(),
              redirect_url: notification.request.content.data?.redirect_url ?? null,
              type: notification.request.content.data?.type ?? null,
            });
          } catch (error) {
            console.error('❌ Error saving notification to database:', error);
          }
        }
      }
    );

    // Triggered when the app is in the background (when the app is closed and the notification is tapped)
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        console.log('📱 Notification background response:', JSON.stringify(response, null, 2));
        const notification = response.notification;
        setNotification(notification);

        if (db) {
          try {
            await insertNotification(db, {
              id: notification.request.identifier,
              title: notification.request.content.title ?? 'Notification',
              body: notification.request.content.body ?? '',
              sent_at: new Date().toISOString(),
              redirect_url: response.notification.request.content.data?.redirect_url ?? null,
              type: response.notification.request.content.data?.type ?? null,
            });
          } catch (error) {
            console.error('❌ Error saving notification response to database:', error);
          }
        }

        // If there is a redirect url, navigate to it. If not, navigate to the notifications screen.
        if (notification.request.content.data?.redirect_url) {
          router.push(notification.request.content.data.redirect_url);
        } else {
          router.push('/notifications');
        }
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
      console.log('✅ Push notification listeners cleaned up.');
    };
  }, [setDeviceId, setExpoPushToken, setNotification]);

  return null;
}
