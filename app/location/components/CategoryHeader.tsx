import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

interface CategoryHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryHeader = React.memo(({ title, isExpanded, onToggle }: CategoryHeaderProps) => (
  <TouchableOpacity
    onPress={onToggle}
    className="mb-3 flex-row items-center justify-between overflow-hidden">
    <Text className="text-2xl font-bold">{title}</Text>
    <View
      className={cn('duration-200 ease-in-out', isExpanded ? 'rotate-180 transform' : 'rotate-0')}>
      <ChevronDown size={20} color={COLORS['ut-grey']} />
    </View>
  </TouchableOpacity>
));

export default CategoryHeader;
