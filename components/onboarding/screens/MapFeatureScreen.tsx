import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const MapFeatureScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="flex-1 items-center justify-center">
        {/* Image/Video placeholder */}
        <View className="mb-8 h-64 w-80 items-center justify-center rounded-3xl bg-gray-100">
          <Ionicons name="map" size={60} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-4 text-sm text-gray-500">Interactive Map Demo</Text>
        </View>

        <View>
          <Text className="mb-2 text-center text-3xl font-bold text-gray-900">
            Interactive Campus Map
          </Text>
          <Text className="text-center text-lg leading-6 text-gray-600 text-balance mx-auto">
            Explore and navigate to 50+ dining halls, food trucks, coffee shops, and convenience 
            stores across campus
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MapFeatureScreen;