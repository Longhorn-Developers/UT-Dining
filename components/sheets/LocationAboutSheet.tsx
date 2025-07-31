import { InfoIcon, MapPin } from 'lucide-react-native';
import { Image, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { type SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PAYMENT_INFO_ICONS } from '~/data/PaymentInfo';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { useLocationName } from '~/utils/locations';
import { generateSchedule } from '~/utils/time';
import { cn } from '~/utils/utils';

const LocationAboutSheet = ({ sheetId, payload }: SheetProps<'location-about'>) => {
  const insets = useSafeAreaInsets();
  const locationName = payload?.location?.name;
  const { locationData, loading, error } = useLocationDetails(locationName || '');
  const { useColloquialNames } = useSettingsStore();
  const displayName = useLocationName(locationName || '', useColloquialNames);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  // Generate schedule from database data
  const schedule = generateSchedule(locationData, false);

  // Get payment methods from database data - ensure it's an array
  const paymentMethods = Array.isArray(locationData?.methods_of_payment)
    ? locationData.methods_of_payment
    : [];

  if (loading) {
    return (
      <ActionSheet
        id={sheetId}
        defaultOverlayOpacity={0.5}
        containerStyle={{ backgroundColor: isDarkMode ? '#171717' : 'white', maxHeight: 600 }}
        gestureEnabled
        safeAreaInsets={insets}
        useBottomSafeAreaPadding
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 600 }}>
          <View className="flex-col gap-y-3 p-6">
            <Text className={cn('text-center', isDarkMode ? 'text-white' : 'text-black')}>
              Loading location details...
            </Text>
          </View>
        </ScrollView>
      </ActionSheet>
    );
  }

  if (error || !locationData) {
    return (
      <ActionSheet
        id={sheetId}
        defaultOverlayOpacity={0.5}
        containerStyle={{ backgroundColor: isDarkMode ? '#171717' : 'white', maxHeight: 600 }}
        gestureEnabled
        safeAreaInsets={insets}
        useBottomSafeAreaPadding
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 600 }}>
          <View className="flex-col gap-y-3 p-6">
            <Text className={cn('text-center', isDarkMode ? 'text-white' : 'text-black')}>
              Unable to load location details
            </Text>
          </View>
        </ScrollView>
      </ActionSheet>
    );
  }

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: isDarkMode ? '#171717' : 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 550 }}>
        <View className="flex-col gap-y-3 p-6">
          <View className="gap-1">
            <View className="flex-row items-center gap-x-2">
              <View>
                <InfoIcon color={COLORS['ut-burnt-orange']} />
              </View>
              <Text className={cn('font-bold text-3xl', isDarkMode ? 'text-white' : 'text-black')}>
                About {displayName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (locationData) {
                  if (Platform.OS === 'ios') {
                    Linking.openURL(locationData.apple_maps_link || '');
                  } else {
                    Linking.openURL(locationData.google_maps_link || '');
                  }
                }
              }}
              className="flex-row items-center gap-x-1"
            >
              <MapPin size={16} color={COLORS['ut-burnt-orange']} />
              <Text className={cn('', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
                {locationData?.address}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={cn(
              'my-1 w-full border-b',
              isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15',
            )}
          />

          <Text className={cn('text-base', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
            {locationData?.description}
          </Text>

          <View
            className={cn(
              'flex-col gap-y-3 rounded-xl p-4',
              isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-neutral-50',
            )}
          >
            <Text
              className={cn('font-semibold text-2xl', isDarkMode ? 'text-white ' : 'text-black')}
            >
              Regular Service Hours
            </Text>
            {schedule.map((schedule) => (
              <View
                key={`${schedule.dayRange}${schedule.time}`}
                className="flex-row items-start justify-between"
              >
                <Text className={cn('font-medium', isDarkMode ? 'text-white' : 'text-black')}>
                  {schedule.dayRange}:
                </Text>
                <Text
                  className={cn('leading-loose', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}
                >
                  {schedule.time.includes(',') ? schedule.time.replace(/, /g, '\n') : schedule.time}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-col gap-y-3">
            <Text
              className={cn('font-semibold text-2xl', isDarkMode ? 'text-white' : 'text-black')}
            >
              Methods of Payment
            </Text>
            <View className="flex-row flex-wrap items-center justify-between gap-4">
              {paymentMethods.map((method) => {
                // Check if method exists in PAYMENT_INFO_ICONS
                if (method in PAYMENT_INFO_ICONS) {
                  return (
                    <View key={method} className="items-center justify-center gap-0.5">
                      <Image
                        className="size-6"
                        source={PAYMENT_INFO_ICONS[method as keyof typeof PAYMENT_INFO_ICONS]}
                      />
                      <Text
                        className={cn('font-medium', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}
                      >
                        {method}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default LocationAboutSheet;
