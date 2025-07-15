import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const MenusFeatureScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="flex-1 items-center justify-center">
        {/* Image/Video placeholder */}
        <View className="mb-8 h-64 w-80 items-center justify-center rounded-3xl bg-gray-100">
          <Ionicons name="restaurant" size={60} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-4 text-sm text-gray-500">Real-time Menus Demo</Text>
        </View>

        <View className="mb-8">
          <Text className="mb-4 text-center text-3xl font-bold text-gray-900">
            Real-time Menus
          </Text>
          <Text className="text-center text-lg leading-6 text-gray-600">
            Browse current menus with comprehensive location details including hours, temporary 
            closures, and special announcements
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row items-center justify-center space-x-8">
        <View className="items-center">
          <Ionicons name="time-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Live Updates</Text>
        </View>
        <View className="items-center">
          <Ionicons name="information-circle-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Location Info</Text>
        </View>
        <View className="items-center">
          <Ionicons name="alert-circle-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Closures</Text>
        </View>
      </View>
    </View>
  );
};

export default MenusFeatureScreen;