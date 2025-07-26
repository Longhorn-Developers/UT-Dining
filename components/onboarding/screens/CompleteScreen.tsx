import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '~/utils/colors';

type Props = {
  width: number;
  handleComplete: () => void;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConfettiPiece = ({ delay, color, size }: { delay: number; color: string; size: number }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(Math.random() * 100 - 50);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(screenHeight + 50, {
        duration: 3000,
        easing: Easing.out(Easing.quad),
      }),
    );

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
      ),
    );

    opacity.value = withDelay(
      delay + 2000,
      withTiming(0, {
        duration: 1000,
      }),
    );
  }, [delay, opacity, rotation, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          top: -20,
          left: screenWidth * 0.4 + Math.random() * (screenWidth * 0.2),
        },
        animatedStyle,
      ]}
    />
  );
};

const CompleteScreen = ({ width, handleComplete }: Props) => {
  const scale = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      300,
      withSpring(1, {
        damping: 15,
        stiffness: 200,
      }),
    );

    checkmarkScale.value = withDelay(
      800,
      withSpring(1, {
        damping: 10,
        stiffness: 300,
      }),
    );
  }, [checkmarkScale, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
    };
  });

  const confettiColors = [
    COLORS['ut-burnt-orange'],
    '#FFD700',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
  ];

  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      {/* Confetti pieces */}
      {Array.from({ length: 20 }).map((_, index) => (
        <ConfettiPiece
          key={`confetti-${
            // biome-ignore lint/suspicious/noArrayIndexKey: we need to use the index as the key
            index
          }`}
          delay={index * 100}
          color={confettiColors[index % confettiColors.length]}
          size={Math.random() * 8 + 4}
        />
      ))}

      <View className="flex-1 items-center justify-center">
        <Animated.View style={[animatedStyle]} className="mb-8 items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Animated.View style={checkmarkStyle}>
              <Ionicons name="checkmark" size={48} color="#10B981" />
            </Animated.View>
          </View>

          <Text className="mb-4 text-center font-bold text-4xl text-gray-900">You're All Set!</Text>
          <Text className="text-center text-gray-600 text-lg leading-6">
            Start exploring UT dining options and never miss a meal again
          </Text>
        </Animated.View>
      </View>

      <View className="mb-4 flex-row items-center justify-center space-x-8">
        <View className="items-center">
          <Ionicons name="rocket-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-gray-600 text-xs">Ready to Go</Text>
        </View>
        <View className="items-center">
          <Ionicons name="star-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-gray-600 text-xs">Explore Now</Text>
        </View>
        <View className="items-center">
          <Ionicons name="restaurant-outline" size={24} color={COLORS['ut-burnt-orange']} />
          <Text className="mt-1 text-gray-600 text-xs">Find Food</Text>
        </View>
      </View>
    </View>
  );
};

export default CompleteScreen;
