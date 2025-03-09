import React from 'react';
import { View, Text } from 'react-native';

interface NutritionFooterProps {
  ingredients?: string;
  allergens: string[];
  dietary: string[];
}

const NutritionFooter = React.memo(({ ingredients, allergens, dietary }: NutritionFooterProps) => (
  <>
    <View className="mb-2">
      <Text className="font-bold">
        Allergens: <Text className="text-xs font-normal">{allergens.join(', ') || 'None'}</Text>
      </Text>
    </View>

    <View className="w-full border-b border-b-ut-grey/15" />

    <View className="my-2">
      <Text className="font-bold">
        Dietary: <Text className="text-xs font-normal">{dietary.join(', ') || 'None'}</Text>
      </Text>
    </View>

    <View className="w-full border-b border-b-ut-grey/15" />

    <View className="my-2">
      <Text className="font-bold">
        Ingredients: <Text className="text-xs font-normal">{ingredients || 'N/A'}</Text>
      </Text>
    </View>
  </>
));

export default NutritionFooter;
