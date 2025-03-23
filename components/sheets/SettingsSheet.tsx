import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { Link, router } from 'expo-router';
import {
  ChefHat,
  Code,
  Filter,
  Heart,
  HelpCircle,
  LucideIcon,
  Mail,
  Shield,
} from 'lucide-react-native';
import { View, Text, Switch, TouchableOpacity, Linking } from 'react-native';
import ActionSheet, {
  ScrollView,
  SheetManager,
  SheetProps,
  useSheetRef,
} from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const SettingsSheet = ({ sheetId, payload }: SheetProps<'settings'>) => {
  const insets = useSafeAreaInsets();
  const sheetRef = useSheetRef('settings');

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
      className="flex-row items-center justify-between border-b border-gray-100 py-3"
      onPress={onPress}
      disabled={!hasChevron && !onPress}>
      <View className="flex-row items-center">
        {Icon && (
          <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-orange-100">
            <Icon size={16} color={COLORS['ut-burnt-orange']} />
          </View>
        )}
        <Text className="text-base font-medium text-gray-800">{title}</Text>
      </View>
      {hasToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#D1D5DB', true: '#F97316' }}
          thumbColor="#FFFFFF"
        />
      )}
      {hasChevron && <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, className }: { title: string; className?: string }) => (
    <Text
      className={cn(
        'py-2 text-sm font-semibold uppercase tracking-wider text-gray-500',
        className
      )}>
      {title}
    </Text>
  );

  const AboutSection = () => (
    <View className="mt-2 rounded-lg bg-gray-50 p-4">
      <Text className="mb-2 text-lg font-semibold text-gray-800">About UT Dining</Text>
      <Text className="text-gray-600">
        UT Dining is your companion app for exploring dining options at the University of Texas.
        Browse menus, check dining hours, and find the perfect meal on campus.
      </Text>
    </View>
  );

  const HelpSupportSection = (): JSX.Element => (
    <View className="mt-4 rounded-lg bg-gray-50 p-4">
      <Text className="mb-2 text-lg font-semibold text-gray-800">Help & Support</Text>
      <TouchableOpacity
        className="mb-2 mt-1 flex-row items-center"
        onPress={() => Linking.openURL('mailto:ethanlanting@gmail.com')}>
        <Mail size={18} color={COLORS['ut-burnt-orange']} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">Contact Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mb-2 flex-row items-center"
        onPress={() =>
          Linking.openURL('https://longhorn-developers.github.io/ut-dining-website/faq')
        }>
        <HelpCircle size={18} color={COLORS['ut-burnt-orange']} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mb-2 flex-row items-center"
        onPress={() =>
          Linking.openURL('https://longhorn-developers.github.io/ut-dining-website/privacy-policy')
        }>
        <Shield size={18} color={COLORS['ut-burnt-orange']} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => Linking.openURL('https://github.com/Longhorn-Developers/UT-Dining')}>
        <Code size={18} color={COLORS['ut-burnt-orange']} className="mr-2" />
        <Text className="ml-2 text-ut-burnt-orange">Source Code</Text>
      </TouchableOpacity>
    </View>
  );

  const CreditsSection = (): JSX.Element => (
    <View className="mt-4 gap-y-2 rounded-lg bg-gray-50 p-4">
      <Text className="text-lg font-semibold text-gray-800">Credits</Text>
      <View>
        <Link href="https://ethanlanting.dev" className="text-base font-medium text-gray-700 ">
          Ethan Lanting
        </Link>
        <Text className="text-gray-600">Lead Developer & Designer</Text>
      </View>
      <View>
        <Text className="text-base font-medium text-gray-700">David Nguyen & Austin Tran</Text>
        <Text className="text-gray-600">Open Source Contributors</Text>
      </View>
      <View>
        <Text className="text-sm text-gray-600">
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
      <Text className="text-sm text-gray-400">Version {Application.nativeApplicationVersion}</Text>
    </View>
  );

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[70vh]">
        <View className="flex-col p-6">
          <Text className="mb-6 text-3xl font-bold">Settings</Text>

          <SectionHeader title="Quick Links" />
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
