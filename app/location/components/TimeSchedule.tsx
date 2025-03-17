import { ChevronDown, Clock } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

interface TimeScheduleProps {
  schedule: { dayRange: string; time: string }[];
  isOpen: boolean;
  onToggle: () => void;
}

const TimeSchedule = React.memo(({ schedule, isOpen, onToggle }: TimeScheduleProps) => (
  <TouchableOpacity onPress={onToggle} className="flex flex-row items-start gap-4">
    {/* Left Column: Day Ranges */}
    <View className="flex flex-col gap-1.5">
      {(isOpen ? schedule : schedule.slice(0, 1)).map((item, index) => (
        <View key={item.dayRange} className="flex flex-row items-center gap-2">
          <View className={index === 0 ? 'flex' : 'invisible'}>
            <Clock size={12} color={COLORS['ut-grey']} />
          </View>
          <Text className={cn('text-sm leading-none text-ut-grey', index === 0 && 'font-semibold')}>
            {item.dayRange}:
          </Text>
        </View>
      ))}
    </View>

    {/* Right Column: Times */}
    <View className="flex flex-col gap-1.5">
      {(isOpen ? schedule : schedule.slice(0, 1)).map((item, index) => (
        <View key={item.dayRange} className="flex flex-row gap-2">
          <Text className="text-sm leading-none text-ut-grey">{item.time}</Text>
          {index === 0 && (
            <View
              className={cn(
                'duration-200 ease-in-out',
                isOpen ? 'rotate-180 transform' : 'rotate-0'
              )}>
              <ChevronDown size={12} color={COLORS['ut-grey']} />
            </View>
          )}
        </View>
      ))}
    </View>
  </TouchableOpacity>
));

export default TimeSchedule;
