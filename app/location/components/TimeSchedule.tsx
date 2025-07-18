import { ChevronDown, Clock } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

interface TimeScheduleProps {
  schedule: { dayRange: string; time: string }[];
  isOpen: boolean;
  onToggle: () => void;
}

const TimeSchedule = ({ schedule, isOpen, onToggle }: TimeScheduleProps) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <TouchableOpacity onPress={onToggle} className="flex flex-row items-start gap-4">
      {/* Left Column: Day Ranges */}
      <View className="flex flex-col gap-1.5">
        {(isOpen ? schedule : schedule.slice(0, 1)).map((item, index) => {
          const timeLines = item.time.split('\n');
          return timeLines.map((_, lineIdx) => (
            <View key={`${item.dayRange}-${lineIdx}`} className="flex flex-row items-center gap-2">
              {lineIdx === 0 ? (
                <View className={index === 0 ? 'flex' : 'invisible'}>
                  <Clock size={12} color={isDarkMode ? '#aaa' : COLORS['ut-grey']} />
                </View>
              ) : (
                <View style={{ width: 12, height: 12 }} />
              )}
              <Text
                className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-300' : 'text-ut-grey',
                  index === 0 && lineIdx === 0 && 'font-semibold',
                  lineIdx > 0 && 'opacity-0', // Hide text for extra lines
                )}
              >
                {lineIdx === 0 ? `${item.dayRange}:` : ''}
              </Text>
            </View>
          ));
        })}
      </View>

      {/* Right Column: Times */}
      <View className="flex flex-col gap-1.5">
        {(isOpen ? schedule : schedule.slice(0, 1)).map((item, index) => {
          const timeLines = item.time.split('\n');
          return timeLines.map((line, lineIdx) => (
            <View
              key={`${item.dayRange}-time-${lineIdx}`}
              className="flex flex-row items-center gap-2"
            >
              <Text className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
                {line}
              </Text>
              {index === 0 && lineIdx === 0 && (
                <View
                  className={cn(
                    'duration-200 ease-in-out',
                    isOpen ? 'rotate-180 transform' : 'rotate-0',
                  )}
                >
                  <ChevronDown size={12} color={isDarkMode ? '#aaa' : COLORS['ut-grey']} />
                </View>
              )}
            </View>
          ));
        })}
      </View>
    </TouchableOpacity>
  );
};

export default TimeSchedule;
