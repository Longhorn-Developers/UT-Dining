import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
  onSelectionChange: (hasSelection: boolean) => void;
};

const MOTIVATION_TAGS = [
  { id: 'save-time', label: 'Save Time', icon: 'time-outline' as const },
  { id: 'discover-food', label: 'Discover New Food', icon: 'restaurant-outline' as const },
  { id: 'track-favorites', label: 'Track Favorites', icon: 'heart-outline' as const },
  { id: 'find-nearby', label: 'Find Nearby Options', icon: 'location-outline' as const },
  { id: 'meal-planning', label: 'Meal Planning', icon: 'calendar-outline' as const },
  { id: 'avoid-crowds', label: 'Avoid Crowds', icon: 'people-outline' as const },
  { id: 'dietary-needs', label: 'Dietary Restrictions', icon: 'leaf-outline' as const },
  { id: 'budget-friendly', label: 'Budget-Friendly Options', icon: 'wallet-outline' as const },
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
        <Text className="mb-4 text-center text-3xl font-bold text-gray-900">
          What brings you here?
        </Text>
        <Text className="text-center text-base text-gray-600">
          Select what motivates you to use UT Dining (optional)
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {MOTIVATION_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              className={cn(
                'mb-4 w-[48%] rounded-xl border-2 p-4',
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
      </ScrollView>
    </View>
  );
};

export default DataCollectionScreen;
