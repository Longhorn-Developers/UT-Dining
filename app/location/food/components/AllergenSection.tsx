import React from 'react';
import { View, Text, Image } from 'react-native';

import { ALLERGEN_ICONS, AllergenKey } from '~/data/AllergenInfo';

interface AllergenSectionProps {
  title: string;
  items: string[];
  showTitle: boolean;
}

const AllergenSection = React.memo(({ title, items, showTitle }: AllergenSectionProps) => (
  <View className="flex-row items-center gap-x-1">
    {showTitle && <Text className="font-medium">{title}</Text>}
    <View className="flex-row gap-x-1">
      {items.map((key) => (
        <View key={key} className="items-center">
          <Image
            source={ALLERGEN_ICONS[key.toLowerCase().replaceAll(' ', '_') as AllergenKey]}
            className="size-4 rounded-full"
            resizeMode="contain"
          />
        </View>
      ))}
    </View>
  </View>
));

export default AllergenSection;
