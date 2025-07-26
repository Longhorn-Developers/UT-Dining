import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
};

const icon = require('~/assets/image.png');


const WelcomeScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="flex-1 items-center justify-center">
        {/* Image/Video placeholder */}
        {/* <View className="mb-8 h-64 w-64 items-center justify-center rounded-3xl bg-gray-100">
          <Ionicons name="restaurant" size={80} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-4 text-sm text-gray-500">Welcome Image/Video</Text>
        </View> */}


        <Image source={icon} className="mb-8 h-64 w-64 items-center justify-center rounded-3xl bg-gray-100" />

        <View className="mb-8">
          <Text className="mb-4 text-center text-4xl font-bold text-gray-900">
            The all-in-one UT Austin dining app 🤘
          </Text>
          <Text className="text-center text-lg leading-6 text-gray-600 max-w-[300px] mx-auto">
            Explore menus, hours, locations, and more—right at your fingertips.
          </Text>
        </View>
      </View>

      {/* <View className="mb-4 flex-row items-center justify-center space-x-8">
        <View className="items-center">
          <Ionicons name="restaurant-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">50+ Locations</Text>
        </View>
        <View className="items-center">
          <Ionicons name="time-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Real-time Updates</Text>
        </View>
        <View className="items-center">
          <Ionicons name="heart-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-xs text-gray-600">Save Favorites</Text>
        </View>
      </View> */}
    </View>
  );
};

export default WelcomeScreen;
