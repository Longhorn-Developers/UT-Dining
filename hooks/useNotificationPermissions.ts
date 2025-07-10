import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';

export function useNotificationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      setPermissionStatus(Notifications.PermissionStatus.DENIED);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Re-check permissions when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkPermissions();
    }, [checkPermissions])
  );

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return Notifications.PermissionStatus.DENIED;
    }
  };

  return {
    permissionStatus,
    isLoading,
    isGranted: permissionStatus === Notifications.PermissionStatus.GRANTED,
    isDenied: permissionStatus === Notifications.PermissionStatus.DENIED,
    isUndetermined: permissionStatus === Notifications.PermissionStatus.UNDETERMINED,
    requestPermissions,
  };
}
