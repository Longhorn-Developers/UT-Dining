import * as Application from 'expo-application';
import { usePostHog } from 'posthog-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, AppState, Linking, Platform } from 'react-native';
import { getSafePostHog } from '~/services/analytics/posthog';
import { getAppInformation } from '~/services/database/database';
import { useDatabase } from './useDatabase';

const APP_STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/us/app/ut-dining/id6743042002',
  android: 'https://play.google.com/store/apps/details?id=com.utdining.app',
});

export const useVersionCheck = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const db = useDatabase();
  const posthog = getSafePostHog(usePostHog());

  // Reset alert state when app comes back to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && !isAlertVisible) {
        // Reset alert state when app becomes active, but only if no alert is currently visible
        setHasShownAlert(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAlertVisible]);

  const showUpdateAlert = useCallback(() => {
    setIsAlertVisible(true);
    Alert.alert(
      'Update Required',
      'A new version is ready. Please update to continue using UT Dining.',
      [
        {
          text: 'Update',
          onPress: async () => {
            setIsAlertVisible(false);
            posthog?.capture('update_button_pressed', {
              platform: Platform.OS,
              app_store_url: APP_STORE_URL ?? '', // Fix: ensure string type for analytics event
            });

            if (APP_STORE_URL) {
              try {
                await Linking.openURL(APP_STORE_URL);
              } catch (error) {
                console.error('Error opening app store:', error);
                posthog?.capture('update_button_error', {
                  error: error instanceof Error ? error.message : 'Unknown error',
                });
              }
            }
          },
        },
        ...(__DEV__
          ? [
              {
                text: 'Cancel',
                style: 'cancel' as const,
                onPress: () => {
                  setIsAlertVisible(false);
                },
              },
            ]
          : []),
      ],
      { cancelable: __DEV__ },
    );
    setHasShownAlert(true);
  }, [posthog]);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Get current app version
        const currentVersion = Application.nativeApplicationVersion;

        // Get app information from database
        const appInfo = await getAppInformation(db);

        if (appInfo?.app_version && currentVersion) {
          const shouldUpdate = compareVersions(currentVersion, appInfo.app_version);

          // Track version check event
          posthog?.capture('version_check_performed', {
            current_version: currentVersion,
            latest_version: appInfo.app_version,
            update_required: shouldUpdate,
          });

          // Show native alert if update is needed
          if (shouldUpdate && !hasShownAlert && !isAlertVisible) {
            console.log(
              '☁️  New version available. Current version:',
              currentVersion,
              'Latest version:',
              appInfo.app_version,
            );
            showUpdateAlert();
          } else {
            console.log('☁️  No update available');
          }
        }
      } catch (error) {
        console.error('Error checking app version:', error);
        posthog?.capture('version_check_error', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkVersion();
  }, [db, posthog, hasShownAlert, isAlertVisible, showUpdateAlert]);

  return { isChecking };
};

/**
 * Compares two version strings to determine if an update is needed
 * @param currentVersion - Current app version
 * @param latestVersion - Latest version from database
 * @returns true if update is needed, false otherwise
 */
const compareVersions = (currentVersion: string, latestVersion: string): boolean => {
  // Simple version comparison - assumes versions are in format "x.y.z"
  const current = currentVersion.split('.').map(Number);
  const latest = latestVersion.split('.').map(Number);

  for (let i = 0; i < Math.max(current.length, latest.length); i++) {
    const currentPart = current[i] || 0;
    const latestPart = latest[i] || 0;

    if (latestPart > currentPart) {
      return true;
    } else if (latestPart < currentPart) {
      return false;
    }
  }

  return false;
};
