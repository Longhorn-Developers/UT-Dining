import React from 'react';
import { View, Text } from 'react-native';

interface NutritionInfoProps {
  icon: React.ReactNode;
  value: string;
}

const NutritionInfo = React.memo(({ icon, value }: NutritionInfoProps) => (
  <View className="flex-row items-center gap-x-1">
    {icon}
    <Text className="text-base font-semibold">{value}</Text>
  </View>
));

export default NutritionInfo;
