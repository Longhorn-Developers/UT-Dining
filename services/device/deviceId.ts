import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { miscStorage } from '~/store/misc-storage';

export function getOrCreateDeviceId(): string {
  const key = 'device_id';
  let deviceId = miscStorage.getString(key);
  if (!deviceId) {
    deviceId = uuidv4();
    miscStorage.set(key, deviceId as string);
  }

  return deviceId ?? '';
}
