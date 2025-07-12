import { isSameDay, addDays, subDays } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useSettingsStore } from '~/store/useSettingsStore';
import {
  addDaysToDate,
  subtractDaysFromDate,
  formatDateForDisplay,
  createDateFromString,
  getCentralTimeDate,
} from '~/utils/date';
import { cn } from '~/utils/utils';

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const currentDate = createDateFromString(selectedDate);
  const displayDate = formatDateForDisplay(currentDate);

  // Calculate date boundaries: 2 days in past, 3 days in future
  const today = getCentralTimeDate();
  const minDate = subDays(today, 2);
  const maxDate = addDays(today, 3);

  // Check if buttons should be disabled
  const isPreviousDisabled = isSameDay(currentDate, minDate) || currentDate < minDate;
  const isNextDisabled = isSameDay(currentDate, maxDate) || currentDate > maxDate;

  // Animation values for previous button
  const previousScale = useSharedValue(1);
  const previousOpacity = useSharedValue(1);

  // Animation values for next button
  const nextScale = useSharedValue(1);
  const nextOpacity = useSharedValue(1);

  const previousAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: previousScale.value }],
    opacity: previousOpacity.value,
  }));

  const nextAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextScale.value }],
    opacity: nextOpacity.value,
  }));

  const handlePreviousDay = async () => {
    if (isPreviousDisabled) return;

    const previousDate = subtractDaysFromDate(currentDate, 1);
    const formattedDate = previousDate.toISOString().split('T')[0];
    onDateChange(formattedDate);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNextDay = async () => {
    if (isNextDisabled) return;

    const nextDate = addDaysToDate(currentDate, 1);
    const formattedDate = nextDate.toISOString().split('T')[0];
    onDateChange(formattedDate);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePreviousPressIn = () => {
    if (isPreviousDisabled) return;
    previousScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    previousOpacity.value = withSpring(0.8, { damping: 15, stiffness: 400 });
  };

  const handlePreviousPressOut = () => {
    if (isPreviousDisabled) return;
    previousScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    previousOpacity.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleNextPressIn = () => {
    if (isNextDisabled) return;
    nextScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    nextOpacity.value = withSpring(0.8, { damping: 15, stiffness: 400 });
  };

  const handleNextPressOut = () => {
    if (isNextDisabled) return;
    nextScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    nextOpacity.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <Reanimated.View
        style={previousAnimatedStyle}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isPreviousDisabled
            ? isDarkMode
              ? 'bg-gray-800 opacity-50'
              : 'bg-gray-200 opacity-50'
            : isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
        )}>
        <Pressable
          onPress={handlePreviousDay}
          onPressIn={handlePreviousPressIn}
          onPressOut={handlePreviousPressOut}
          disabled={isPreviousDisabled}
          className="h-full w-full items-center justify-center">
          <ChevronLeft
            size={20}
            color={
              isPreviousDisabled ? (isDarkMode ? '#4B5563' : '#9CA3AF') : isDarkMode ? '#fff' : '#000'
            }
          />
        </Pressable>
      </Reanimated.View>

      <View className="flex-1 items-center">
        <Text className={cn('text-lg font-semibold', isDarkMode ? 'text-white' : 'text-black')}>
          {displayDate}
        </Text>
      </View>

      <Reanimated.View
        style={nextAnimatedStyle}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isNextDisabled
            ? isDarkMode
              ? 'bg-gray-800 opacity-50'
              : 'bg-gray-200 opacity-50'
            : isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
        )}>
        <Pressable
          onPress={handleNextDay}
          onPressIn={handleNextPressIn}
          onPressOut={handleNextPressOut}
          disabled={isNextDisabled}
          className="h-full w-full items-center justify-center">
          <ChevronRight
            size={20}
            color={
              isNextDisabled ? (isDarkMode ? '#4B5563' : '#9CA3AF') : isDarkMode ? '#fff' : '#000'
            }
          />
        </Pressable>
      </Reanimated.View>
    </View>
  );
};

export default DateNavigator;
