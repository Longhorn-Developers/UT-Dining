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
import { View, Text, Switch, TouchableOpacity, Linking } from 'react-native';
import ActionSheet, {
  ScrollView,
  SheetManager,
  SheetProps,
  useSheetRef,
} from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '~/store/useSettingsStore';
import { getColor } from '~/utils/colors';
import { cn } from '~/utils/utils';

const SettingsSheet = ({ sheetId, payload }: SheetProps<'settings'>) => {
  const insets = useSafeAreaInsets();
  const sheetRef = useSheetRef('settings');
  const {
    useColloquialNames,
    toggleColloquialNames,
    isDarkMode,
    toggleDarkMode,
    isColorBlindMode,
    toggleColorBlindMode,
  } = useSettingsStore();

  const SettingItem = ({
    title,
    Icon,
    hasToggle = false,
    toggleValue = false,
    onToggle = () => {},
    hasChevron = false,
    onPress = () => {},
  }: {
    title: string;
    Icon?: LucideIcon;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: () => void;
    hasChevron?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      className={cn(
        'flex-row items-center justify-between border-b py-3',
        isDarkMode ? 'border-gray-700' : 'border-gray-100'
      )}
      onPress={onPress}
      disabled={!hasChevron && !onPress}>
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
        <Text
          className={cn('text-base font-medium', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
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

  const SectionHeader = ({ title, className }: { title: string; className?: string }) => (
    <Text
      className={cn(
        'py-2 text-sm font-semibold uppercase tracking-wider',
        isDarkMode ? 'text-gray-400' : 'text-gray-500',
        className
      )}>
      {title}
    </Text>
  );

  const AboutSection = () => (
    <View className={cn('mt-2 rounded-lg p-4', isDarkMode ? 'bg-gray-800' : 'bg-gray-50')}>
      <Text
        className={cn(
          'mb-2 text-lg font-semibold',
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        )}>
        About UT Dining
      </Text>
      <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
        UT Dining is your companion app for exploring dining options at the University of Texas.
        Browse menus, check dining hours, and find the perfect meal on campus.
      </Text>
    </View>
  );

  const HelpSupportSection = (): JSX.Element => (
    <View className={cn('mt-4 rounded-lg p-4', isDarkMode ? 'bg-gray-800' : 'bg-gray-50')}>
      <Text
        className={cn(
          'mb-2 text-lg font-semibold',
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        )}>
        Help & Support
      </Text>
      <TouchableOpacity
        className="mb-2 mt-1 flex-row items-center"
        onPress={() => Linking.openURL('mailto:ethanlanting@gmail.com')}>
        <Mail size={18} color={getColor('ut-burnt-orange', false)} className="mr-2" />
        <Text style={{ color: getColor('ut-burnt-orange', false) }} className="ml-2">
          Contact Support
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mb-2 flex-row items-center"
        onPress={() =>
          Linking.openURL('https://longhorn-developers.github.io/ut-dining-website/faq')
        }>
        <HelpCircle size={18} color={getColor('ut-burnt-orange', false)} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mb-2 flex-row items-center"
        onPress={() =>
          Linking.openURL('https://longhorn-developers.github.io/ut-dining-website/privacy-policy')
        }>
        <Shield size={18} color={getColor('ut-burnt-orange', false)} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => Linking.openURL('https://github.com/Longhorn-Developers/UT-Dining')}>
        <Code size={18} color={getColor('ut-burnt-orange', false)} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">Source Code</Text>
      </TouchableOpacity>
    </View>
  );

  const CreditsSection = (): JSX.Element => (
    <View className={cn('mt-4 gap-y-2 rounded-lg p-4', isDarkMode ? 'bg-gray-800' : 'bg-gray-50')}>
      <Text className={cn('text-lg font-semibold', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
        Credits
      </Text>
      <View>
        <Link
          href="https://ethanlanting.dev"
          className={cn('text-base font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700')}>
          Ethan Lanting
        </Link>
        <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Lead Developer & Designer
        </Text>
      </View>
      <View>
        <Text
          className={cn('text-base font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700')}>
          David Nguyen, Austin Tran, & Ali Vayani
        </Text>
        <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
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

  const VersionInfo = (): JSX.Element => (
    <View className="mt-6 items-center">
      <Text className={cn('text-sm', isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
        Version {Application.nativeApplicationVersion}
      </Text>
    </View>
  );

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: isDarkMode ? '#111827' : 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[70vh]">
        <View className="flex-col p-6">
          <Text className={cn('mb-6 text-3xl font-bold', isDarkMode ? 'text-white' : 'text-black')}>
            Settings
          </Text>

          <SectionHeader title="Quick Links" className="mt-4" />
          <SettingItem
            title="Meal Plan"
            Icon={ChefHat}
            hasChevron
            onPress={() => {
              sheetRef.current.hide();
              router.push('/meal-plan');
            }}
          />
          <SettingItem
            title="Favorites"
            Icon={Heart}
            hasChevron
            onPress={() => {
              sheetRef.current.hide();
              router.push('/favorites');
            }}
          />
          <SettingItem
            title="Filters"
            Icon={Filter}
            hasChevron
            onPress={() => {
              SheetManager.show('filters');
            }}
          />
          <SectionHeader title="Display" className="mt-4" />
          <SettingItem
            title="Dark Mode"
            Icon={Moon}
            hasToggle
            toggleValue={isDarkMode}
            onToggle={toggleDarkMode}
          />
          <SettingItem
            title="Colorblind Mode"
            Icon={Accessibility}
            hasToggle
            toggleValue={isColorBlindMode}
            onToggle={toggleColorBlindMode}
          />
          <SettingItem
            title="Use Colloquial Names"
            Icon={Type}
            hasToggle
            toggleValue={useColloquialNames}
            onToggle={toggleColloquialNames}
          />
          <SectionHeader title="Information" className="mt-4" />
          <AboutSection />
          <CreditsSection />
          <HelpSupportSection />

          <VersionInfo />
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default SettingsSheet;
