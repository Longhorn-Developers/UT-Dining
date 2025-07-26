import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
  onSelectionChange: (hasSelection: boolean) => void;
};

const MOTIVATION_TAGS = [
  { id: 'view-menus', label: 'View Menus', icon: 'book-outline' as const },
  { id: 'see-nearby', label: 'See What’s Near Me', icon: 'location-outline' as const },
  { id: 'check-hours', label: 'Check Hours & Status', icon: 'alarm-outline' as const },
  { id: 'save-time', label: 'Save Time', icon: 'time-outline' as const },
  { id: 'try-new-places', label: 'Try New Places', icon: 'restaurant-outline' as const },
  { id: 'track-favorites', label: 'Keep Track of Favorites', icon: 'heart-outline' as const },
  { id: 'plan-meals', label: 'Plan My Meals', icon: 'calendar-outline' as const },
  { id: 'filter-by-diet', label: 'Filter by Diet', icon: 'leaf-outline' as const },
];

const DataCollectionScreen = ({ width, onSelectionChange }: Props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelection);
    onSelectionChange(newSelection.length > 0);
  };

  return (
    <View style={{ width }} className="flex-1 px-6 py-8">
      <View className="mb-8">
        <Text className="text-center text-3xl font-bold text-gray-900">
          Before we get started...
        </Text>
        <Text className="text-center text-base text-gray-600">
        Tell us what you’re hoping to get out of UT Dining
        </Text>
      </View>

      <View
        className="flex-1"
        >
        <View className="flex-row flex-wrap justify-between">
          {MOTIVATION_TAGS.map((tag) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              className={cn(
                'mb-4 w-[48%] rounded-xl border p-4',
                selectedTags.includes(tag.id)
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange/10'
                  : 'border-gray-200 bg-white'
              )}>
              <View className="items-center">
                <Ionicons
                  name={tag.icon}
                  size={32}
                  color={
                    selectedTags.includes(tag.id) ? COLORS['ut-burnt-orange'] : COLORS['ut-grey']
                  }
                  className="mb-2"
                />
                <Text
                  className={cn(
                    'text-center text-sm font-medium',
                    selectedTags.includes(tag.id) ? 'text-ut-burnt-orange' : 'text-gray-700'
                  )}>
                  {tag.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default DataCollectionScreen;
