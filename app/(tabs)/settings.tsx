import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { Link, router } from 'expo-router';
import {
  Accessibility,
  ChefHat,
  Code,
  Filter,
  Heart,
  HelpCircle,
  LucideIcon,
  Mail,
  Moon,
  Shield,
  Type,
} from 'lucide-react-native';
import React from 'react';
import { View, Text, Switch, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SheetProvider, SheetManager } from 'react-native-actions-sheet';

import { Container } from '~/components/Container';
import { useDatabase } from '~/hooks/useDatabase';
import { getAppInformation } from '~/services/database/database';
import { AppInformation } from '~/services/database/schema';
import { getOrCreateDeviceId } from '~/services/device/deviceId';
import { useSettingsStore } from '~/store/useSettingsStore';
import { getColor } from '~/utils/colors';
import { cn } from '~/utils/utils';

interface SettingItemProps {
  title: string;
  Icon?: LucideIcon;
  hasToggle?: boolean;
  toggleValue?: boolean;
  activeOpacity?: number;
  onToggle?: () => void;
  hasChevron?: boolean;
  onPress?: () => void;
  isDarkMode: boolean;
}

const SettingItem = ({
  title,
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
      isDarkMode ? 'border-gray-700' : 'border-gray-100'
    )}
    onPress={onPress}
    disabled={!hasChevron && !onPress}
    activeOpacity={activeOpacity}>
    <View className="flex-row items-center">
      {Icon && (
        <View
          className={cn(
            'mr-3 h-8 w-8 items-center justify-center rounded-full',
            isDarkMode ? 'bg-gray-800' : 'bg-orange-100'
          )}>
          <Icon size={16} color={getColor('ut-burnt-orange', false)} />
        </View>
      )}
      <Text className={cn('text-base font-medium', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
        {title}
      </Text>
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
      'py-2 text-sm font-semibold uppercase tracking-wider',
      isDarkMode ? 'text-gray-400' : 'text-gray-500',
      className
    )}>
    {title}
  </Text>
);

interface AboutSectionProps {
  appInfo: AppInformation;
  isDarkMode: boolean;
}

const AboutSection = ({ appInfo, isDarkMode }: AboutSectionProps) => (
  <View
    className={cn('mt-2 rounded-lg p-4', isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-gray-50')}>
    <Text
      className={cn('mb-2 text-lg font-semibold', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
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
      className={cn('mt-4 rounded-lg p-4', isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-gray-50')}>
      <Text
        className={cn(
          'mb-2 text-lg font-semibold',
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        )}>
        Help & Support
      </Text>
      {supportLinks.map((link) => (
        <TouchableOpacity
          key={link.id}
          className="mb-2 flex-row items-center"
          onPress={() => Linking.openURL(link.url)}>
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
      isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-gray-50'
    )}>
    <Text className={cn('text-lg font-semibold', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
      Credits
    </Text>
    <View>
      <Link
        href="https://ethanlanting.dev"
        className={cn('text-base font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700')}>
        Ethan Lanting
      </Link>
      <Text className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>
        Lead Developer & Designer
      </Text>
    </View>
    <View>
      <Text className={cn('text-base font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700')}>
        {appInfo.credits_contributors
          .sort((a, b) => a.order - b.order)
          .map((contributor) => contributor.name)
          .join(', ')}
      </Text>
      <Text className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>
        Open Source Contributors
      </Text>
    </View>
    <View>
      <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
        Adopted by{' '}
        <Link
          href="https://github.com/Longhorn-Developers"
          className="font-medium not-italic text-ut-burnt-orange underline">
          Longhorn Developers
        </Link>
      </Text>
    </View>
  </View>
);

interface VersionInfoProps {
  isDarkMode: boolean;
  appInfo?: any;
}

const VersionInfo = ({ isDarkMode, appInfo }: VersionInfoProps): JSX.Element => {
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

const SettingsPage = () => {
  const {
    useColloquialNames,
    toggleColloquialNames,
    isDarkMode,
    toggleDarkMode,
    isColorBlindMode,
    toggleColorBlindMode,
  } = useSettingsStore();

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
        className={cn('m-0', isDarkMode ? 'bg-[#111827]' : 'bg-white')}
        disableBottomPadding>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : 'white' }}
          contentContainerStyle={{ padding: 24 }}>
          <Text className={cn('text-3xl font-bold', isDarkMode ? 'text-white' : 'text-black')}>
            Settings
          </Text>
          <SectionHeader title="Quick Links" className="mt-4" isDarkMode={isDarkMode} />
          <SettingItem
            activeOpacity={0.5}
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
            activeOpacity={0.5}
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
