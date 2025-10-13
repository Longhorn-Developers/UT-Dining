import { ChevronDown } from 'lucide-react-native';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

interface CategoryHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryHeader = React.memo(({ title, isExpanded, onToggle }: CategoryHeaderProps) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="mb-3 flex-row items-center justify-between overflow-hidden"
    >
      <Skeleton.Group show={title === 'skeleton'}>
        <Skeleton radius={8} colorMode={isDarkMode ? 'dark' : 'light'}>
          <Text className={cn('font-bold text-2xl', isDarkMode ? 'text-white' : 'text-black')}>
            {title}
          </Text>
        </Skeleton>
        <Skeleton radius={8} colorMode={isDarkMode ? 'dark' : 'light'}>
          <View
            className={cn(
              'duration-200 ease-in-out',
              isExpanded ? 'rotate-180 transform' : 'rotate-0',
            )}
          >
            <ChevronDown size={20} color={isDarkMode ? '#fff' : COLORS['ut-grey']} />
          </View>
        </Skeleton>
      </Skeleton.Group>
    </TouchableOpacity>
  );
});

export default CategoryHeader;
