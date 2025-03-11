import { InfoIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View, Image } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALLERGEN_ICONS, ALLERGEN_EXCEPTIONS } from '~/data/AllergenInfo';
import { COLORS } from '~/utils/colors';

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

const FoodInfoSheet = ({ sheetId }: SheetProps<'food-info'>) => {
  const insets = useSafeAreaInsets();
  const { allergens, dietary } = categorizeAllergens();

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[60vh]">
        <View className="p-6">
          {/* Header */}
          <View>
            <View className="mb-2 flex-row items-center gap-x-2">
              <InfoIcon color={COLORS['ut-burnt-orange']} />
              <Text className="text-3xl font-bold">Food Legend</Text>
            </View>
          </View>

          {/* Allergens Section */}
          <View>
            <Text className="text-xl font-semibold">Allergens</Text>
            <Text className="mb-3 text-sm text-ut-grey">
              Foods containing these allergens are labeled
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {allergens.map((item) => (
                <View key={item.key} className="mb-4 w-[21%] items-center">
                  <View className="mb-1 rounded-full border border-gray-200 bg-gray-50 p-3">
                    <Image
                      source={item.icon}
                      className="size-10 rounded-full"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-center text-xs font-medium text-ut-grey">
                    {item.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View className="mb-4 w-full border-b border-b-ut-grey/15" />

          {/* Dietary Section */}
          <View>
            <Text className="text-xl font-semibold">Dietary Preferences</Text>
            <Text className="mb-3 text-sm text-ut-grey">
              Foods that meet these preferences are labeled
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {dietary.map((item) => (
                <View key={item.key} className="mb-4 w-[21%] items-center">
                  <View className="mb-1 rounded-full border border-gray-200 bg-gray-50 p-3">
                    <Image source={item.icon} className="size-10" resizeMode="contain" />
                  </View>
                  <Text className="text-center text-xs font-medium text-ut-grey">
                    {item.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default FoodInfoSheet;
