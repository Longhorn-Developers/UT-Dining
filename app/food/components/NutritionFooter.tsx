import React from 'react';
import { Text, View } from 'react-native';

import { cn } from '~/utils/utils';

interface NutritionFooterProps {
  ingredients?: string;
  allergens: string[];
  dietary: string[];
  isDarkMode?: boolean;
}

const NutritionFooter = React.memo(
  ({ ingredients, allergens, dietary, isDarkMode }: NutritionFooterProps) => (
    <>
      <View className="mb-2">
        <Text className={cn('font-bold', isDarkMode ? 'text-white' : 'text-black')}>
          Allergens:{' '}
          <Text
            className={cn('font-normal text-xs', isDarkMode ? 'text-gray-300' : 'text-gray-700')}
          >
            {allergens.join(', ') || 'None'}
          </Text>
        </Text>
      </View>

      <View
        className={cn('w-full border-b', isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15')}
      />

      <View className="my-2">
        <Text className={cn('font-bold', isDarkMode ? 'text-white' : 'text-black')}>
          Dietary:{' '}
          <Text
            className={cn('font-normal text-xs', isDarkMode ? 'text-gray-300' : 'text-gray-700')}
          >
            {dietary.join(', ') || 'None'}
          </Text>
        </Text>
      </View>

      <View
        className={cn('w-full border-b', isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15')}
      />

      <View className="my-2">
        <Text className={cn('font-bold', isDarkMode ? 'text-white' : 'text-black')}>
          Ingredients:{' '}
          <Text
            className={cn('font-normal text-xs', isDarkMode ? 'text-gray-300' : 'text-gray-700')}
          >
            {ingredients || 'N/A'}
          </Text>
        </Text>
      </View>
    </>
  ),
);

export default NutritionFooter;
