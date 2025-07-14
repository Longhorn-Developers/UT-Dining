import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const FeaturesScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-4xl font-bold">Explore Features</Text>
      <Text className="mb-8 text-center text-lg text-gray-600">
        Browse menus, check hours, save favorites, and get real-time updates on dining options.
      </Text>
      <View className="mb-8 flex-row space-x-4">
        <Ionicons name="restaurant" size={40} color={COLORS['ut-burnt-orange']} />
        <Ionicons name="time" size={40} color={COLORS['ut-burnt-orange']} />
        <Ionicons name="heart" size={40} color={COLORS['ut-burnt-orange']} />
      </View>
    </View>
  );
};

export default FeaturesScreen;
