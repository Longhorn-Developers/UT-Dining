import { HeartIcon, CircleX, ChefHatIcon } from 'lucide-react-native';
import React from 'react';
import { ViewStyle } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';

import { COLORS } from '~/utils/colors';

export const FavoriteAction = ({ progress }: { progress: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const translateX = interpolate(progress.value, [0, 1], [50, -20], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0, 1], [0.4, 1.2], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.2, 1], [0, 1, 1], Extrapolation.CLAMP);
    return {
      transform: [{ scale }, { translateX }],
      opacity,
    };
  });

  const backgroundStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.8, 1],
        ['#ff7400', COLORS['ut-burnt-orange'], COLORS['ut-burnt-orange']]
      ),
    };
  });

  return (
    <Reanimated.View
      style={backgroundStyle}
      className="min-w-[6.5rem] flex-row items-center justify-end pr-4">
      <Reanimated.View style={animatedStyle}>
        <HeartIcon fill="#fff" stroke="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
};

export const RemoveAction = ({ progress }: { progress: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const translateX = interpolate(progress.value, [0, 1], [50, -20], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0, 1], [0.4, 1.2], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.2, 1], [0, 1, 1], Extrapolation.CLAMP);
    return {
      transform: [{ scale }, { translateX }],
      opacity,
    };
  });

  const backgroundStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.8, 1],
        ['#ff7400', COLORS['ut-burnt-orange'], COLORS['ut-burnt-orange']]
      ),
    };
  });

  return (
    <Reanimated.View
      style={backgroundStyle}
      className="min-w-[6.5rem] flex-row items-center justify-end pr-4">
      <Reanimated.View style={animatedStyle}>
        <CircleX stroke="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
};

export const AddMealPlanAction = ({ progress }: { progress: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const translateX = interpolate(progress.value, [0, 1], [-110, -20], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0, 1], [0.4, 1.2], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.2, 1], [0, 1, 1], Extrapolation.CLAMP);
    return {
      transform: [{ scale }, { translateX }],
      opacity,
    };
  });

  const backgroundStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.8, 1],
        ['#ff7400', COLORS['ut-burnt-orange'], COLORS['ut-burnt-orange']]
      ),
    };
  });

  return (
    <Reanimated.View
      style={backgroundStyle}
      className="min-w-[6.5rem] flex-row items-center justify-end pr-4">
      <Reanimated.View style={animatedStyle}>
        <ChefHatIcon fill="#fff" stroke="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
};
