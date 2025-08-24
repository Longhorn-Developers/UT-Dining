import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as Application from 'expo-application';
import { Link, router } from 'expo-router';
import {
  Accessibility,
  Bell,
  ChefHat,
  Code,
  Filter,
  Heart,
  HelpCircle,
  History,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  RefreshCcw,
  Shield,
  Star,
  Type,
} from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';

import { Container } from '~/components/Container';
import { useDatabase } from '~/hooks/useDatabase';
import { useLocationPermissions } from '~/hooks/useLocationPermissions';
import { useNotificationPermissions } from '~/hooks/useNotificationPermissions';
import { getAppInformation } from '~/services/database/database';
import type { AppInformation } from '~/services/database/schema';
import { getOrCreateDeviceId } from '~/services/device/deviceId';
import { useAppLaunchStore } from '~/store/useAppLaunchStore';
import { useDataSyncStore } from '~/store/useDataSyncStore';
import { useOnboardingStore } from '~/store/useOnboardingStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { getColor } from '~/utils/colors';
import { fetchMenuData } from '~/utils/queries';
import { cn } from '~/utils/utils';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  hasToggle?: boolean;
  toggleValue?: boolean;
  activeOpacity?: number;
  onToggle?: () => void;
  hasChevron?: boolean;
  onPress?: () => void;
  isDarkMode: boolean;
}

const ITUNES_ITEM_ID = '6743042002';

const SettingItem = ({
  title,
  subtitle,
  Icon,
  hasToggle = false,
  toggleValue = false,
  activeOpacity = 1,
  onToggle = () => {},
  hasChevron = false,
  onPress = () => {},
  isDarkMode,
}: SettingItemProps) => (
  <TouchableOpacity
    className={cn(
      'flex-row items-center justify-between border-b py-3',
      isDarkMode ? 'border-neutral-800' : 'border-gray-100',
    )}
    onPress={onPress}
    disabled={!hasChevron && !onPress}
    activeOpacity={activeOpacity}
  >
    <View className="flex-row items-center">
      {Icon && (
        <View
          className={cn(
            'mr-3 h-8 w-8 items-center justify-center rounded-full',
            isDarkMode ? 'bg-neutral-800' : 'bg-orange-100',
          )}
        >
          <Icon size={16} color={getColor('ut-burnt-orange', false)} />
        </View>
      )}
      <View>
        <Text
          className={cn('font-medium text-base', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    {hasToggle && (
      <Switch
        value={toggleValue}
        onValueChange={onToggle}
        trackColor={{ false: '#D1D5DB', true: getColor('ut-burnt-orange', false) }}
        thumbColor="#FFFFFF"
      />
    )}
    {hasChevron && (
      <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#888' : '#9CA3AF'} />
    )}
  </TouchableOpacity>
);

interface SectionHeaderProps {
  title: string;
  className?: string;
  isDarkMode: boolean;
}

const SectionHeader = ({ title, className, isDarkMode }: SectionHeaderProps) => (
  <Text
    className={cn(
      'py-2 font-semibold text-sm uppercase tracking-wider',
      isDarkMode ? 'text-gray-400' : 'text-gray-500',
      className,
    )}
  >
    {title}
  </Text>
);

interface AboutSectionProps {
  appInfo: AppInformation;
  isDarkMode: boolean;
}

const AboutSection = ({ appInfo, isDarkMode }: AboutSectionProps) => (
  <View
    className={cn('mt-2 rounded-lg p-4', isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-neutral-50')}
  >
    <Text
      className={cn('mb-2 font-semibold text-lg', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
    >
      {appInfo.about_title}
    </Text>
    <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
      {appInfo.about_description}
    </Text>
  </View>
);

interface HelpSupportSectionProps {
  appInfo: AppInformation;
  isDarkMode: boolean;
}

const LABEL_TO_ICON = {
  'Contact Support': <Mail size={18} color={getColor('ut-burnt-orange', false)} />,
  FAQ: <HelpCircle size={18} color={getColor('ut-burnt-orange', false)} />,
  'Privacy Policy': <Shield size={18} color={getColor('ut-burnt-orange', false)} />,
  'Source Code': <Code size={18} color={getColor('ut-burnt-orange', false)} />,
};

const HelpSupportSection = ({ appInfo, isDarkMode }: HelpSupportSectionProps): JSX.Element => {
  const supportLinks = appInfo.support_links.sort((a, b) => a.order - b.order);

  return (
    <View
      className={cn(
        'mt-4 rounded-lg p-4',
        isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-neutral-50',
      )}
    >
      <Text
        className={cn('mb-2 font-semibold text-lg', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
      >
        Help & Support
      </Text>
      {supportLinks.map((link) => (
        <TouchableOpacity
          key={link.id}
          className="mb-2 flex-row items-center"
          onPress={() => Linking.openURL(link.url)}
        >
          {LABEL_TO_ICON[link.label as keyof typeof LABEL_TO_ICON]}
          <Text className="ml-2 text-ut-burnt-orange">{link.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface CreditsSectionProps {
  appInfo: AppInformation;
  isDarkMode: boolean;
}

const CreditsSection = ({ appInfo, isDarkMode }: CreditsSectionProps): JSX.Element => (
  <View
    className={cn(
      'mt-4 gap-y-2 rounded-lg p-4',
      isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-neutral-50',
    )}
  >
    <Text className={cn('font-semibold text-lg', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
      Credits
    </Text>
    <View>
      <Link
        href="https://ethanlanting.dev"
        className={cn('font-medium text-base', isDarkMode ? 'text-gray-200' : 'text-black')}
      >
        Ethan Lanting
      </Link>
      <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
        Lead Developer & Designer
      </Text>
    </View>
    <View>
      <Text className={cn('font-medium text-base', isDarkMode ? 'text-gray-200' : 'text-black')}>
        {appInfo.credits_contributors
          .sort((a, b) => a.order - b.order)
          .map((contributor) => contributor.name)
          .join(', ')}
      </Text>
      <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
        Open Source Contributors
      </Text>
    </View>
    <View>
      <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
        Adopted by{' '}
        <Link
          href="https://github.com/Longhorn-Developers"
          className="font-medium text-ut-burnt-orange not-italic underline"
        >
          Longhorn Developers
        </Link>
      </Text>
    </View>
  </View>
);

interface VersionInfoProps {
  isDarkMode: boolean;
  appInfo: AppInformation | null;
}

const NotificationSettingsSection = ({ isDarkMode }: { isDarkMode: boolean }): JSX.Element => {
  const { isGranted, isDenied, isUndetermined, requestPermissions } = useNotificationPermissions();

  const handleNotificationAction = async () => {
    if (isUndetermined) {
      await requestPermissions();
    } else if (isDenied) {
      Linking.openSettings();
    }
  };

  const getStatusText = () => {
    if (isGranted) return 'Notifications Enabled';
    if (isDenied) return 'Notifications Disabled';
    return 'Notifications Disabled';
  };

  const getDescriptionText = () => {
    if (isGranted) return 'You’ll receive helpful updates and alerts';
    if (isDenied) return 'Currently disabled - tap to open Settings';
    return 'Tap to enable push notifications';
  };

  return (
    <TouchableOpacity
      className={cn(
        'flex-row items-center justify-between border-b py-3',
        isDarkMode ? 'border-neutral-800' : 'border-gray-100',
      )}
      onPress={handleNotificationAction}
      activeOpacity={isGranted ? 1 : 0.7}
    >
      <View className="flex-row items-center">
        <View
          className={cn(
            'mr-3 h-8 w-8 items-center justify-center rounded-full',
            isDarkMode ? 'bg-neutral-800' : 'bg-orange-100',
          )}
        >
          <Bell size={16} color={getColor('ut-burnt-orange', false)} />
        </View>
        <View className="flex-1">
          <Text
            className={cn('font-medium text-base', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
          >
            {getStatusText()}
          </Text>
          <Text className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
            {getDescriptionText()}
          </Text>
        </View>

        {isDenied ||
          (isUndetermined && (
            <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#888' : '#9CA3AF'} />
          ))}
      </View>
    </TouchableOpacity>
  );
};

const LocationSettingsSection = ({ isDarkMode }: { isDarkMode: boolean }): JSX.Element => {
  const { isGranted, isDenied, isUndetermined, requestPermissions } = useLocationPermissions();

  const handleLocationAction = async () => {
    if (isUndetermined) {
      await requestPermissions();
    } else if (isDenied) {
      Linking.openSettings();
    }
  };

  const getStatusText = () => {
    if (isGranted) return 'Location Enabled';
    if (isDenied) return 'Location Disabled';
    return 'Location Access Disabled';
  };

  const getDescriptionText = () => {
    if (isGranted) return 'Used to show your location on the map';
    if (isDenied) return 'Currently disabled - tap to open Settings';
    return 'Tap to enable location access';
  };

  return (
    <TouchableOpacity
      className={cn(
        'flex-row items-center justify-between border-b py-3',
        isDarkMode ? 'border-neutral-800' : 'border-gray-100',
      )}
      onPress={handleLocationAction}
      activeOpacity={isGranted ? 1 : 0.7}
    >
      <View className="flex-row items-center">
        <View
          className={cn(
            'mr-3 h-8 w-8 items-center justify-center rounded-full',
            isDarkMode ? 'bg-neutral-800' : 'bg-orange-100',
          )}
        >
          <MapPin size={16} color={getColor('ut-burnt-orange', false)} />
        </View>
        <View className="flex-1">
          <Text
            className={cn('font-medium text-base', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
          >
            {getStatusText()}
          </Text>
          <Text className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
            {getDescriptionText()}
          </Text>
        </View>

        {isDenied ||
          (isUndetermined && (
            <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#888' : '#9CA3AF'} />
          ))}
      </View>
    </TouchableOpacity>
  );
};

const SyncDataSection = ({ isDarkMode }: { isDarkMode: boolean }): JSX.Element => {
  const { getTimeSinceLastSync } = useDataSyncStore();
  const db = useDatabase();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncError, setSyncError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  // Update every minute to keep the time display current
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const timeSinceSync = getTimeSinceLastSync();
  const lastSyncText = formatTimeSinceSync(timeSinceSync);

  const handleSync = async () => {
    if (!db || isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      await fetchMenuData(db, true);
      await queryClient.invalidateQueries({ queryKey: ['menuData'] });
    } catch (error) {
      setSyncError('Failed to sync data');
      console.warn('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getDescriptionText = () => {
    if (isSyncing) return 'Syncing...';
    if (syncError) return syncError;
    return `Last synced: ${lastSyncText}`;
  };

  return (
    <TouchableOpacity
      className={cn(
        'flex-row items-center justify-between border-b py-3',
        isDarkMode ? 'border-neutral-800' : 'border-gray-100',
      )}
      onPress={handleSync}
      disabled={isSyncing}
      activeOpacity={isSyncing ? 1 : 0.7}
    >
      <View className="flex-row items-center">
        <View
          className={cn(
            'mr-3 h-8 w-8 items-center justify-center rounded-full',
            isDarkMode ? 'bg-neutral-800' : 'bg-orange-100',
          )}
        >
          <RefreshCcw size={16} color={getColor('ut-burnt-orange', false)} />
        </View>
        <View className="flex-1">
          <Text
            className={cn('font-medium text-base', isDarkMode ? 'text-gray-100' : 'text-gray-800')}
          >
            Sync Data
          </Text>
          <Text
            className={cn(
              'text-sm',
              syncError ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500',
            )}
          >
            {getDescriptionText()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VersionInfo = ({ isDarkMode }: VersionInfoProps): JSX.Element => {
  const deviceId = getOrCreateDeviceId();

  return (
    <View className="mt-6 items-center">
      <Text className={cn('text-sm', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
        Version {Application.nativeApplicationVersion}
      </Text>
      {deviceId && (
        <Text className={cn('mt-1 text-[10px]', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
          {deviceId}
        </Text>
      )}
    </View>
  );
};

const formatTimeSinceSync = (timeSinceSync: number): string => {
  if (timeSinceSync === Infinity) {
    return 'Never synced';
  }

  const seconds = Math.floor(timeSinceSync / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
};

const SettingsPage = () => {
  const {
    useColloquialNames,
    toggleColloquialNames,
    isDarkMode,
    toggleDarkMode,
    isColorBlindMode,
    toggleColorBlindMode,
  } = useSettingsStore();
  const { resetOnboarding } = useOnboardingStore();
  const { resetRatingPrompt } = useAppLaunchStore();
  const db = useDatabase();
  const [appInfo, setAppInfo] = React.useState<AppInformation | null>(null);

  React.useEffect(() => {
    const fetchAppInfo = async () => {
      if (db) {
        const info = await getAppInformation(db);
        setAppInfo(info);
      }
    };
    fetchAppInfo();
  }, [db]);

  return (
    <SheetProvider context="settings">
      <Container
        className={cn('m-0', isDarkMode ? 'bg-[#171717]' : 'bg-white')}
        disableBottomPadding
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: isDarkMode ? '#171717' : 'white' }}
          contentContainerStyle={{ padding: 24 }}
        >
          <Text className={cn('font-extrabold text-3xl', isDarkMode ? 'text-white' : 'text-black')}>
            Settings
          </Text>
          <SectionHeader title="Quick Links" className="mt-4" isDarkMode={isDarkMode} />
          <SettingItem
            activeOpacity={0.7}
            title="Favorites"
            Icon={Heart}
            hasChevron
            isDarkMode={isDarkMode}
            onPress={() => {
              router.navigate('/');
              setTimeout(() => {
                router.push('/favorites');
              }, 10);
            }}
          />
          <SettingItem
            activeOpacity={0.7}
            title="Meal Plan"
            Icon={ChefHat}
            hasChevron
            isDarkMode={isDarkMode}
            onPress={() => {
              router.navigate('/');
              setTimeout(() => {
                router.push('/meal-plan');
              }, 10);
            }}
          />
          <SettingItem
            activeOpacity={0.7}
            title="Filters"
            Icon={Filter}
            hasChevron
            isDarkMode={isDarkMode}
            onPress={() => {
              SheetManager.show('filters', {
                context: 'settings',
              });
            }}
          />
          <SectionHeader title="Display" className="mt-4" isDarkMode={isDarkMode} />
          <SettingItem
            title="Dark Mode"
            Icon={Moon}
            hasToggle
            toggleValue={isDarkMode}
            onToggle={toggleDarkMode}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            title="Colorblind Mode"
            Icon={Accessibility}
            hasToggle
            toggleValue={isColorBlindMode}
            onToggle={toggleColorBlindMode}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            title="Use Colloquial Names"
            Icon={Type}
            hasToggle
            toggleValue={useColloquialNames}
            onToggle={toggleColloquialNames}
            isDarkMode={isDarkMode}
          />
          <SectionHeader title="Data" className="mt-4" isDarkMode={isDarkMode} />
          <SyncDataSection isDarkMode={isDarkMode} />

          <SectionHeader title="App Permissions" className="mt-4" isDarkMode={isDarkMode} />
          <NotificationSettingsSection isDarkMode={isDarkMode} />
          <LocationSettingsSection isDarkMode={isDarkMode} />

          <SectionHeader title="Feedback" className="mt-4" isDarkMode={isDarkMode} />
          <SettingItem
            activeOpacity={0.7}
            title="Submit Suggestions"
            Icon={MessageSquare}
            hasChevron
            isDarkMode={isDarkMode}
            onPress={() => Linking.openURL('https://utdining.userjot.com')}
            subtitle="Suggest a feature or report a bug"
          />
          <SettingItem
            activeOpacity={0.7}
            title="Enjoying the app?"
            Icon={Star}
            hasChevron
            isDarkMode={isDarkMode}
            onPress={() =>
              Linking.openURL(
                `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${ITUNES_ITEM_ID}?action=write-review`,
              )
            }
            subtitle="Leave a quick review — it means a lot!"
          />
          <SettingItem
            activeOpacity={0.7}
            title="Changelog"
            Icon={History}
            hasChevron
            isDarkMode={isDarkMode}
            onPress={() => Linking.openURL('https://utdining.userjot.com/updates')}
          />

          {__DEV__ && (
            <>
              <SectionHeader
                title="Development (only visible in dev mode)"
                className="mt-4"
                isDarkMode={isDarkMode}
              />
              <SettingItem
                activeOpacity={0.7}
                title="Reset Onboarding"
                Icon={RefreshCcw}
                hasChevron
                isDarkMode={isDarkMode}
                onPress={() => {
                  console.log(
                    '⚠️  Resetting onboarding. Go to the home screen to see the onboarding again.',
                  );
                  resetOnboarding();
                }}
              />
              <SettingItem
                activeOpacity={0.7}
                title="Reset Rating Prompt"
                Icon={RefreshCcw}
                hasChevron
                isDarkMode={isDarkMode}
                onPress={() => {
                  console.log(
                    '⚠️  Resetting rating prompt. It will show on the next second launch.',
                  );
                  resetRatingPrompt();
                }}
                subtitle="Reset the rating prompt to test it again"
              />
            </>
          )}

          <SectionHeader title="Information" className="mt-4" isDarkMode={isDarkMode} />
          {appInfo && <AboutSection appInfo={appInfo} isDarkMode={isDarkMode} />}
          {appInfo && <CreditsSection appInfo={appInfo} isDarkMode={isDarkMode} />}
          {appInfo && <HelpSupportSection appInfo={appInfo} isDarkMode={isDarkMode} />}
          <VersionInfo isDarkMode={isDarkMode} appInfo={appInfo} />
        </ScrollView>
      </Container>
    </SheetProvider>
  );
};

export default SettingsPage;
