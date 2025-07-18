import React from 'react';
import { Image, Text, View } from 'react-native';

import { ALLERGEN_ICONS, type AllergenKey } from '~/data/AllergenInfo';
import { cn } from '~/utils/utils';

interface AllergenSectionProps {
  title: string;
  items: string[];
  showTitle: boolean;
  isDarkMode?: boolean;
}

const AllergenSection = React.memo(
  ({ title, items, showTitle, isDarkMode }: AllergenSectionProps) => (
    <View className="flex-row items-center gap-x-1">
      {showTitle && (
        <Text className={cn('font-medium', isDarkMode ? 'text-gray-300' : 'text-black')}>
          {title}
        </Text>
      )}
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
  ),
);

export default AllergenSection;
