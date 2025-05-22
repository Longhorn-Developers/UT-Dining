import { InfoIcon, MapPin } from 'lucide-react-native';
import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getLocationName } from '~/data/LocationInfo';
import { PAYMENT_INFO_ICONS, PaymentMethod } from '~/data/PaymentInfo';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { generateSchedule } from '~/utils/time';
import { cn } from '~/utils/utils';

const paymentMethods: PaymentMethod[] = Object.keys(PAYMENT_INFO_ICONS) as PaymentMethod[];

const LocationAboutSheet = ({ sheetId, payload }: SheetProps<'location-about'>) => {
  const insets = useSafeAreaInsets();
  const location = payload?.location;
  const schedule = generateSchedule(location?.name || '', false);
  const { useColloquialNames } = useSettingsStore();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: isDarkMode ? '#1F2937' : 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <View className="flex-col gap-y-3 p-6">
        <View className="gap-1">
          <View className="flex-row items-center gap-x-2">
            <View>
              <InfoIcon color={COLORS['ut-burnt-orange']} />
            </View>
            <Text className={cn('text-3xl font-bold', isDarkMode ? 'text-white' : 'text-black')}>
              About {location && getLocationName(location.name, useColloquialNames)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (location) {
                if (Platform.OS === 'ios') {
                  Linking.openURL(location.appleMapsLink);
                } else {
                  Linking.openURL(location.googleMapsLink);
                }
              }
            }}
            className="flex-row items-center gap-x-1">
            <MapPin size={16} color={COLORS['ut-burnt-orange']} />
            <Text className={cn('', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              {location?.address}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className={cn(
            'my-1 w-full border-b',
            isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15'
          )}
        />

        <Text className={cn('text-base', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
          {location?.description}
        </Text>

        <View className="flex-col gap-y-2">
          <Text className={cn('text-2xl font-semibold', isDarkMode ? 'text-white' : 'text-black')}>
            Regular Service Hours
          </Text>
          {schedule.map((schedule, index) => (
            <View key={index + '-schedule'} className="flex-row items-start justify-between">
              <Text className={cn('font-medium', isDarkMode ? 'text-white' : 'text-black')}>
                {schedule.dayRange}:
              </Text>
              <Text className={cn('leading-loose', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
                {schedule.time.includes(',') ? schedule.time.replace(/, /g, '\n') : schedule.time}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-col gap-y-3">
          <Text className={cn('text-2xl font-semibold', isDarkMode ? 'text-white' : 'text-black')}>
            Methods of Payment
          </Text>
          <View className="flex-row flex-wrap items-center justify-between gap-4">
            {paymentMethods.map((method, index) => (
              <View key={index} className="items-center justify-center gap-0.5">
                <Image className="size-6" source={PAYMENT_INFO_ICONS[method]} />
                <Text className={cn('font-medium', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
                  {method}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};

export default LocationAboutSheet;
