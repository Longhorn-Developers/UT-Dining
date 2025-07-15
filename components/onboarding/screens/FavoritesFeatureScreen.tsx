import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const FavoritesFeatureScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="flex-1 items-center justify-center">
        {/* Image/Video placeholder */}
        <View className="mb-8 h-64 w-80 items-center justify-center rounded-3xl bg-gray-100">
          <Ionicons name="heart" size={60} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-4 text-sm text-gray-500">Favorites & Notifications Demo</Text>
        </View>

        <View className="mb-8">
          <Text className="mb-4 text-center text-3xl font-bold text-gray-900">
            Favorites & Meal Planning
          </Text>
          <Text className="text-center text-lg leading-6 text-gray-600">
            Save your favorite meals and get notified when they're available on campus menus
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row items-center justify-center space-x-8">
        <View className="items-center">
          <Ionicons name="heart-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Save Favorites</Text>
        </View>
        <View className="items-center">
          <Ionicons name="notifications-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Get Notified</Text>
        </View>
        <View className="items-center">
          <Ionicons name="calendar-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Plan Meals</Text>
        </View>
      </View>
    </View>
  );
};

export default FavoritesFeatureScreen;