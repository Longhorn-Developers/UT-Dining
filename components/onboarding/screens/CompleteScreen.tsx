import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  width: number;
  handleComplete: () => void;
};

const CompleteScreen = ({ width, handleComplete }: Props) => {
  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-4xl font-bold">You're All Set!</Text>
      <Text className="mb-8 text-center text-lg text-gray-600">
        Start exploring UT dining options and never miss a meal again.
      </Text>
      <TouchableOpacity
        onPress={handleComplete}
        className="mb-8 rounded-full bg-orange-500 px-8 py-4">
        <Text className="text-lg font-semibold text-white">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompleteScreen;
