import { isSameDay, addDays, subDays } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <TouchableOpacity
        onPress={handlePreviousDay}
        disabled={isPreviousDisabled}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isPreviousDisabled
            ? isDarkMode
              ? 'bg-gray-800 opacity-50'
              : 'bg-gray-200 opacity-50'
            : isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
        )}
        activeOpacity={isPreviousDisabled ? 1 : 0.7}>
        <ChevronLeft
          size={20}
          color={
            isPreviousDisabled ? (isDarkMode ? '#4B5563' : '#9CA3AF') : isDarkMode ? '#fff' : '#000'
          }
        />
      </TouchableOpacity>

      <View className="flex-1 items-center">
        <Text className={cn('text-lg font-semibold', isDarkMode ? 'text-white' : 'text-black')}>
          {displayDate}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleNextDay}
        disabled={isNextDisabled}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isNextDisabled
            ? isDarkMode
              ? 'bg-gray-800 opacity-50'
              : 'bg-gray-200 opacity-50'
            : isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
        )}
        activeOpacity={isNextDisabled ? 1 : 0.7}>
        <ChevronRight
          size={20}
          color={
            isNextDisabled ? (isDarkMode ? '#4B5563' : '#9CA3AF') : isDarkMode ? '#fff' : '#000'
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default DateNavigator;
