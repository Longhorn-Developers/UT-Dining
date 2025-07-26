import type React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useSettingsStore } from '~/store/useSettingsStore';
import { cn } from '~/utils/utils';

interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  step,
  totalSteps,
  className,
}) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const progressStyle = useAnimatedStyle(() => {
    const progress = (step / (totalSteps - 1)) * 100;
    return {
      width: withSpring(`${Math.max(1, Math.min(100, progress))}%`, {
        damping: 20,
        stiffness: 200,
      }),
      transform: [{ translateX: withSpring(0) }],
    };
  });

  return (
    <View
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full',
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
        className,
      )}
    >
      <Animated.View className="h-full rounded-full bg-ut-burnt-orange/75" style={progressStyle} />
    </View>
  );
};
