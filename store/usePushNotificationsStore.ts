import * as Notifications from 'expo-notifications';
import { create } from 'zustand';

interface PushNotificationsState {
  deviceId: string;
  expoPushToken: string;
  notification: Notifications.Notification | null;
  setDeviceId: (id: string) => void;
  setExpoPushToken: (token: string) => void;
  setNotification: (notification: Notifications.Notification | null) => void;
}

export const usePushNotificationsStore = create<PushNotificationsState>((set) => ({
  deviceId: '',
  expoPushToken: '',
  notification: null,

  setDeviceId: (id) => set({ deviceId: id }),
  setExpoPushToken: (token) => set({ expoPushToken: token }),
  setNotification: (notification) => set({ notification }),
}));
