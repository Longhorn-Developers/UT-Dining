import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { CircleAlert, MapPin } from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';
import type React from 'react';
import { useEffect } from 'react';
import { InteractionManager, Platform, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, {
  type ActionSheetRef,
  ScrollView,
  useSheetRef,
} from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSafePostHog } from '~/services/analytics/posthog';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS, getColor } from '~/utils/colors';
import { cn } from '~/utils/utils';

type MapLocationProps = {
  sheetId: string;
  payload: {
    name: string;
    address: string;
    description: string;
    type: string;
    hasMenu: boolean;
    note?: string;
  };
  ref: React.RefObject<ActionSheetRef>;
};

const MapLocationSheet = ({ payload, sheetId }: MapLocationProps) => {
  const { name, address, description, hasMenu, type, note } = payload;
  const ref = useSheetRef(sheetId);

  const insets = useSafeAreaInsets();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const isColorBlindMode = useSettingsStore((state) => state.isColorBlindMode);
  const analytics = getSafePostHog(usePostHog());

  const handleOpenMaps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const encodedAddress = encodeURIComponent(address.replace(/\s/g, '+'));
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?address=${encodedAddress}`
        : `https://www.google.com/maps/place/${encodedAddress}`;
    Linking.openURL(url);
  };

  // biome-ignorelint/correctness/useExhaustiveDependencies: analytics only
  useEffect(() => {
    analytics.screen(`${name}-map-sheet`);
  }, []);

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.2}
      containerStyle={{
        backgroundColor: isDarkMode ? '#171717' : 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      indicatorStyle={{
        backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB',
        width: 60,
      }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding
      backgroundInteractionEnabled
    >
      <ScrollView showsHorizontalScrollIndicator={false} className="max-h-[60vh] p-5">
        {/* Location header */}
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className={cn('font-bold text-3xl', isDarkMode && 'text-white')}>{name}</Text>
            <View className="mt-2 flex-col gap-y-2">
              <View className="flex-row items-center gap-x-3">
                {/* Location Type Pill */}
                {type && (
                  <View>
                    <View
                      className={cn(
                        'self-start rounded-full px-3 py-1',
                        isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-ut-grey/5',
                      )}
                    >
                      <Text
                        className={cn(
                          'font-bold text-xs uppercase',
                          isDarkMode ? 'text-white' : 'text-black/75',
                        )}
                      >
                        {type}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity className="flex-row items-center" onPress={handleOpenMaps}>
                <MapPin
                  size={16}
                  color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']}
                />
                <Text
                  className={cn(
                    'ml-1 pr-4 text-base',
                    isDarkMode ? 'text-ut-grey-dark-mode' : 'text-ut-grey',
                  )}
                >
                  {address}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={cn(
                'my-2 h-1 w-full border-b',
                isDarkMode ? 'border-neutral-800' : 'border-b-ut-grey/15',
              )}
            />
          </View>
        </View>

        {/* Description */}
        <View className="mb-3">
          <Text className={cn('text-base leading-6', isDarkMode && 'text-white')}>
            {description}
          </Text>
        </View>

        {/* Special note */}
        {note && (
          <View className="mb-4 flex-row items-center gap-x-3 self-start rounded-xl bg-ut-burnt-orange/10 px-4 py-2.5">
            <CircleAlert color={getColor('ut-burnt-orange', isColorBlindMode)} size={18} />
            <Text className="font-medium text-sm text-ut-burnt-orange">{note}</Text>
          </View>
        )}

        {/* Navigation button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-2 rounded-xl bg-ut-burnt-orange py-3.5 shadow-sm"
          style={{
            backgroundColor: getColor('ut-burnt-orange', isColorBlindMode),
          }}
          onPress={handleOpenMaps}
        >
          <Text className="text-center font-bold text-white">Directions</Text>
        </TouchableOpacity>

        {type !== 'microwave' && (
          <TouchableOpacity
            activeOpacity={0.8}
            className={cn(
              'mt-3 rounded-xl border py-3.5 shadow-sm',
              isDarkMode ? 'border-ut-grey-dark-mode/20' : 'border-ut-grey/30',
            )}
            onPress={() => {
              if (hasMenu) {
                // First redirect to home tab and then redirect to location after interactions
                ref.current?.hide();
                router.replace('/');

                InteractionManager.runAfterInteractions(() => {
                  router.navigate(`/location/${name}`);
                });
              } else {
                ref.current?.hide();
                router.replace('/');

                InteractionManager.runAfterInteractions(() => {
                  router.navigate(`/location_generic/${name}`);
                });
              }
            }}
          >
            <Text
              className={cn(
                'text-center font-semibold',
                isDarkMode ? 'text-ut-grey-dark-mode' : 'text-ut-grey',
              )}
            >
              More Info
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ActionSheet>
  );
};

export default MapLocationSheet;
