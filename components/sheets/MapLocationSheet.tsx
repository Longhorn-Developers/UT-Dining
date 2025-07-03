import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { CircleAlert, MapPin } from 'lucide-react-native';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { ActionSheetRef, ScrollView, useSheetRef } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const handleOpenMaps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const encodedAddress = encodeURIComponent(address.replace(/\s/g, '+'));
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?address=${encodedAddress}`
        : `https://www.google.com/maps/place/${encodedAddress}`;
    Linking.openURL(url);
  };

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.2}
      containerStyle={{
        backgroundColor: isDarkMode ? '#111827' : 'white',
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
      backgroundInteractionEnabled>
      <ScrollView showsHorizontalScrollIndicator={false} className="p-5">
        {/* Location header */}
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className={cn('text-3xl font-bold', isDarkMode && 'text-white')}>{name}</Text>
            <View className="mt-2 flex-col gap-y-2">
              <View className="flex-row items-center gap-x-3">
                {/* Location Type Pill */}
                {type && (
                  <View>
                    <View
                      className={cn(
                        'self-start rounded-full px-3 py-1',
                        isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-ut-grey/5'
                      )}>
                      <Text
                        className={cn(
                          'text-xs font-bold uppercase',
                          isDarkMode ? 'text-white' : 'text-black/75'
                        )}>
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
                    'ml-1 text-base',
                    isDarkMode ? 'text-ut-grey-dark-mode' : 'text-ut-grey'
                  )}>
                  {address}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={cn(
                'my-2 h-1 w-full border-b',
                isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15'
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
            <Text className="text-sm font-medium text-ut-burnt-orange">{note}</Text>
          </View>
        )}

        {/* Navigation button */}
        <TouchableOpacity
          className="mt-2 rounded-xl bg-ut-burnt-orange py-3.5 shadow-sm"
          style={{
            backgroundColor: getColor('ut-burnt-orange', isColorBlindMode),
          }}
          onPress={handleOpenMaps}>
          <Text className="text-center font-bold text-white">Directions</Text>
        </TouchableOpacity>

        {type !== 'microwave' && (
          <TouchableOpacity
            className={cn(
              'mt-3 rounded-xl border py-3.5 shadow-sm',
              isDarkMode ? 'border-ut-grey-dark-mode/20' : 'border-ut-grey/30'
            )}
            onPress={() => {
              if (hasMenu) {
                // First redirect to home tab wait 10ms and then redirect to location
                ref.current?.hide();
                router.replace('/');

                setTimeout(() => {
                  router.push(`/location/${name}`);
                }, 10);
              } else {
                ref.current?.hide();
                router.replace('/');

                setTimeout(() => {
                  router.push(`/location_generic/${name}`);
                }, 10);
              }
            }}>
            <Text
              className={cn(
                'text-center font-semibold',
                isDarkMode ? 'text-ut-grey-dark-mode' : 'text-ut-grey'
              )}>
              More Info
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ActionSheet>
  );
};

export default MapLocationSheet;
