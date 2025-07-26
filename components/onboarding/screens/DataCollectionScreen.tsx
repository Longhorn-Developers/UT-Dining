import * as Haptics from 'expo-haptics';
import { Book, Calendar, Clock, Heart, Leaf, MapPin, Timer, Utensils } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type Props = {
  width: number;
  onSelectionChange: (hasSelection: boolean) => void;
};

const MOTIVATION_TAGS = [
  { id: 'view-menus', label: 'View Menus', icon: Book },
  { id: 'see-nearby', label: "See What's Near Me", icon: MapPin },
  { id: 'check-hours', label: 'Check Hours & Status', icon: Clock },
  { id: 'save-time', label: 'Save Time', icon: Timer },
  { id: 'try-new-places', label: 'Try New Places', icon: Utensils },
  { id: 'track-favorites', label: 'Keep Track of Favorites', icon: Heart },
  { id: 'plan-meals', label: 'Plan My Meals', icon: Calendar },
  { id: 'filter-by-diet', label: 'Filter by Diet', icon: Leaf },
];

const DataCollectionScreen = ({ width, onSelectionChange }: Props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleTag = (tagId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelection);
    onSelectionChange(newSelection.length > 0);
  };

  return (
    <View style={{ width }} className={cn('flex-1 px-6 py-8', isDark ? 'bg-gray-900' : 'bg-white')}>
      <View className="mb-8">
        <Text
          className={cn(
            'mb-1 text-center font-bold text-3xl',
            isDark ? 'text-white' : 'text-gray-900',
          )}
        >
          Before we get started...
        </Text>
        <Text className={cn('text-center text-lg', isDark ? 'text-gray-300' : 'text-gray-600')}>
          What are you hoping to get out of UT Dining?
        </Text>
      </View>

      <View className="flex-1">
        <View className="flex-row flex-wrap justify-between">
          {MOTIVATION_TAGS.map((tag) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              className={cn(
                'mb-4 w-[48%] rounded-xl  p-4',
                selectedTags.includes(tag.id)
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange/10'
                  : isDark
                    ? ' bg-gray-800'
                    : 'border border-gray-200 bg-white',
              )}
            >
              <View className="items-center">
                <tag.icon
                  size={32}
                  color={
                    selectedTags.includes(tag.id)
                      ? COLORS['ut-burnt-orange']
                      : isDark
                        ? COLORS['ut-grey-dark-mode']
                        : COLORS['ut-grey']
                  }
                />
                <Text
                  className={cn(
                    'text-center font-medium text-sm mt-2',
                    selectedTags.includes(tag.id)
                      ? 'text-ut-burnt-orange'
                      : isDark
                        ? 'text-gray-300'
                        : 'text-gray-700',
                  )}
                >
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
