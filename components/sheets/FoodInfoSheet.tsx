import { InfoIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View, Image } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALLERGEN_ICONS, ALLERGEN_EXCEPTIONS } from '~/data/AllergenInfo';
import { COLORS } from '~/utils/colors';

// Helper function to chunk arrays into rows of exactly four items
const chunkArray = (array: [string, any][], size: number) => {
  const chunks: [string, any][][] = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    while (chunk.length < size) {
      chunk.push(['placeholder', null]); // Fill row with placeholders
    }
    chunks.push(chunk);
  }
  return chunks;
};

const FoodInfoSheet = ({ sheetId }: SheetProps<'food-info'>) => {
  const insets = useSafeAreaInsets();

  // Split allergens and dietary items
  const allergens = Object.entries(ALLERGEN_ICONS).filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key));
  const dietary = Object.entries(ALLERGEN_ICONS).filter(([key]) => ALLERGEN_EXCEPTIONS.has(key));

  return (
    <ActionSheet
      id={sheetId}
      defaultOverlayOpacity={0.5}
      containerStyle={{ backgroundColor: 'white' }}
      gestureEnabled
      safeAreaInsets={insets}
      useBottomSafeAreaPadding>
      <View className="flex-col gap-y-4 p-6">
        {/* Header */}
        <View>
          <View className="flex-row items-center gap-x-2">
            <InfoIcon color={COLORS['ut-burnt-orange']} />
            <Text className="text-3xl font-bold">Allergen & Dietary Legend</Text>
          </View>
          <Text className="mt-1 text-gray-700">
            <Text className="font-bold text-ut-burnt-orange">Disclaimer:</Text> Allergen and dietary
            data may be inaccurate. Use discretion when making dietary choices.
          </Text>
        </View>

        {/* Divider */}
        <View className="w-full border-b border-b-ut-grey/15" />

        {/* Allergens Section */}
        <View className="gap-y-1">
          <Text className="text-2xl font-bold">Allergens</Text>
          <View className="mt-2 gap-6">
            {chunkArray(allergens, 4).map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-between">
                {row.map(([allergen, iconSource], colIndex) => (
                  <View key={colIndex} className="flex w-1/4 items-center">
                    {iconSource ? (
                      <>
                        <Image source={iconSource} className="size-8" resizeMode="contain" />
                        <Text className="mt-2 text-center text-sm font-medium capitalize">
                          {allergen.replace(/_/g, ' ')}
                        </Text>
                      </>
                    ) : (
                      <View className="h-10 w-10 opacity-0" /> // Invisible placeholder
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Dietary Section */}
        <View className="gap-y-1">
          <Text className="text-2xl font-bold">Dietary</Text>
          <View className="mt-2 gap-6">
            {chunkArray(dietary, 4).map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-between">
                {row.map(([allergen, iconSource], colIndex) => (
                  <View key={colIndex} className="flex w-1/4 items-center">
                    {iconSource ? (
                      <>
                        <Image source={iconSource} className="size-8" resizeMode="contain" />
                        <Text className="mt-2 text-center text-sm font-medium capitalize">
                          {allergen.replace(/_/g, ' ')}
                        </Text>
                      </>
                    ) : (
                      <View className="h-10 w-10 opacity-0" /> // Invisible placeholder
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};

export default FoodInfoSheet;
