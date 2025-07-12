import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';

export function useLocationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking location permissions:', error);
      setPermissionStatus(Location.PermissionStatus.DENIED);
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return Location.PermissionStatus.DENIED;
    }
  };

  return {
    permissionStatus,
    isLoading,
    isGranted: permissionStatus === Location.PermissionStatus.GRANTED,
    isDenied: permissionStatus === Location.PermissionStatus.DENIED,
    isUndetermined:
      !permissionStatus || permissionStatus === Location.PermissionStatus.UNDETERMINED,
    requestPermissions,
  };
}
