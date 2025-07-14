import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const PermissionsScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-4xl font-bold">Enable Location</Text>
      <Text className="mb-8 text-center text-lg text-gray-600">
        Allow location access to find nearby dining halls and get personalized recommendations.
      </Text>
      <Ionicons name="location" size={80} color={COLORS['ut-burnt-orange']} className="mb-8" />
    </View>
  );
};

export default PermissionsScreen;
