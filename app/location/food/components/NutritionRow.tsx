import React from 'react';
import { View, Text } from 'react-native';

import { DAILY_VALUES, INDENTED_NUTRITION } from '~/data/AllergenInfo';
import { cn } from '~/utils/utils';

interface NutritionRowProps {
  item: { key: string; value: unknown };
}

const NutritionRow = React.memo(({ item }: NutritionRowProps) => {
  const nutrientValue = parseFloat(String(item.value ?? 0));
  const percentage = getPercentage(nutrientValue, item.key);

  return (
    <View className="mb-2 px-6">
      <View
        className={cn(
          'mb-2 flex-row justify-between',
          INDENTED_NUTRITION.has(item.key) ? 'pl-4' : ''
        )}>
        <View className="flex-row gap-x-0.5">
          {item.key === 'Trans Fat' ? (
            <>
              <Text className={cn('italic', INDENTED_NUTRITION.has(item.key) && 'font-normal')}>
                Trans
              </Text>
              <Text className={cn(INDENTED_NUTRITION.has(item.key) && 'font-normal')}> Fat</Text>
            </>
          ) : (
            <Text className={cn(INDENTED_NUTRITION.has(item.key) ? 'font-normal' : 'font-bold')}>
              {item.key}
            </Text>
          )}
          <Text>{item.key === 'Calories' ? ` ${item.value} kcal` : ` ${item.value}`}</Text>
        </View>
        <View>{DAILY_VALUES[item.key] && <Text className="font-bold">{percentage}%</Text>}</View>
      </View>
      <View className="w-full border-b border-b-ut-grey/15" />
    </View>
  );
});

// Helper function to calculate percentage of daily value
function getPercentage(value: number, key: string) {
  return Math.round((value / (DAILY_VALUES[key] || 1)) * 100);
}

export default NutritionRow;
