import React from 'react';
import { View, Text } from 'react-native';

import { cn } from '~/utils/utils';

interface NutritionInfoProps {
  icon: React.ReactNode;
  value: string;
  isDarkMode?: boolean;
}

const NutritionInfo = React.memo(({ icon, value, isDarkMode }: NutritionInfoProps) => (
  <View className="flex-row items-center gap-x-1">
    {icon}
    <Text className={cn('text-base font-semibold', isDarkMode ? 'text-gray-300' : 'text-black')}>
      {value}
    </Text>
  </View>
));

export default NutritionInfo;
