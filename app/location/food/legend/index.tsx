import { InfoIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View, Image } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALLERGEN_ICONS, ALLERGEN_EXCEPTIONS } from '~/data/AllergenInfo';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

// Helper function to organize allergen data
const categorizeAllergens = () => {
  const allergens = Object.entries(ALLERGEN_ICONS)
    .filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key))
    .map(([key, icon]) => ({
      key,
      icon,
      displayName: key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));

  const dietary = Object.entries(ALLERGEN_ICONS)
    .filter(([key]) => ALLERGEN_EXCEPTIONS.has(key))
    .map(([key, icon]) => ({
      key,
      icon,
      displayName: key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));

  return { allergens, dietary };
};

const FoodInfoSheet = () => {
  //   const insets = useSafeAreaInsets();
  const { allergens, dietary } = categorizeAllergens();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <View style={{ backgroundColor: isDarkMode ? '#1F2937' : 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[60vh]">
        <View className="p-6">
          {/* Header */}
          <View>
            <View className="mb-2 flex-row items-center gap-x-2">
              <InfoIcon color={COLORS['ut-burnt-orange']} />
              <Text className={cn('text-3xl font-bold', isDarkMode ? 'text-white' : 'text-black')}>
                Food Legend
              </Text>
            </View>
          </View>

          {/* Allergens Section */}
          <View>
            <Text className={cn('text-xl font-semibold', isDarkMode ? 'text-white' : 'text-black')}>
              Allergens
            </Text>
            <Text className={cn('mb-3 text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              Foods containing these allergens are labeled
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {allergens.map((item) => (
                <View key={item.key} className="mb-4 w-[21%] items-center">
                  <View
                    className={cn(
                      'mb-1 rounded-full border p-3',
                      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                    <Image
                      source={item.icon}
                      className="size-10 rounded-full"
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    className={cn(
                      'text-center text-xs font-medium',
                      isDarkMode ? 'text-gray-300' : 'text-ut-grey'
                    )}>
                    {item.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View
            className={cn(
              'mb-4 w-full border-b',
              isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15'
            )}
          />

          {/* Dietary Section */}
          <View>
            <Text className={cn('text-xl font-semibold', isDarkMode ? 'text-white' : 'text-black')}>
              Dietary Preferences
            </Text>
            <Text className={cn('mb-3 text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              Foods that meet these preferences are labeled
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {dietary.map((item) => (
                <View key={item.key} className="mb-4 w-[21%] items-center">
                  <View
                    className={cn(
                      'mb-1 rounded-full border p-3',
                      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                    <Image source={item.icon} className="size-10" resizeMode="contain" />
                  </View>
                  <Text
                    className={cn(
                      'text-center text-xs font-medium',
                      isDarkMode ? 'text-gray-300' : 'text-ut-grey'
                    )}>
                    {item.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FoodInfoSheet;
