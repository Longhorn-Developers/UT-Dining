import { PostHog } from 'posthog-react-native';
import { PostHogEventProperties } from 'posthog-react-native/lib/posthog-core/src';

export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const IS_DEV = __DEV__;

export const POSTHOG_CONFIG = {
  apiKey: POSTHOG_API_KEY,
  options: {
    host: 'https://us.i.posthog.com',
    enableSessionReplay: true,
    disabled: IS_DEV,
  },
  autocapture: {
    captureScreens: true,
    captureTouches: true,
    customLabelProp: 'ph-label',
    navigation: {
      routeToName: (name: string, params?: { id?: string }) => {
        if (params?.id) return `${name}/${params.id}`;
        return name;
      },
    },
  },
  debug: false, // Set true if using PostHog in development
} as const;

/**
 * Type-safe wrapper for PostHog instance that handles undefined case
 * @param posthog PostHog instance from usePostHog hook
 * @returns Safe PostHog instance with all methods wrapped to handle undefined
 */
export function getSafePostHog(posthog: PostHog | undefined) {
  return {
    screen: (name?: string, properties?: PostHogEventProperties) => {
      if (posthog && name) {
        posthog.screen(name, properties);
      }
    },
    capture: (eventName: string, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.capture(eventName, properties);
      }
    },
  };
}

// Log warning only once on app start
if (!POSTHOG_API_KEY) {
  console.warn(
    '⚠️ PostHog analytics are disabled. To enable analytics, add EXPO_PUBLIC_POSTHOG_API_KEY to your environment variables. See README.md for more information.'
  );
} else if (POSTHOG_CONFIG.options.disabled) {
  console.log(
    'ℹ️  PostHog analytics disabled in development mode. To enable analytics in development, set `disabled: false` in POSTHOG_CONFIG options.'
  );
} else if (!POSTHOG_CONFIG.debug) {
  console.log('✅ PostHog analytics enabled (debug disabled)');
} else {
  console.log('✅ PostHog analytics enabled (debug enabled)');
}
