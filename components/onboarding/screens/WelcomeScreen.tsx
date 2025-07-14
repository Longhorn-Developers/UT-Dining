import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  width: number;
};

const WelcomeScreen = ({ width }: Props) => {
  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-4xl font-bold">Welcome to UT Dining!</Text>
      <Text className="mb-8 text-center text-lg text-gray-600">
        Discover dining halls, menus, and hours across campus with ease.
      </Text>
      <View className="mb-8 h-32 w-32 rounded-full bg-orange-500" />
    </View>
  );
};

export default WelcomeScreen;
