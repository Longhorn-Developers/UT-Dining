import * as Haptics from 'expo-haptics';
import { Filter } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { COLORS } from '~/utils/colors';
import { timeOfDay } from '~/utils/time';
import { cn } from '~/utils/utils';

type FilterBarProps = {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  items: { id: string; title: string }[]; // Accepts dynamic items array
  showFilterButton?: boolean;
  useTimeOfDayDefault?: boolean;
};

// Define the proper meal order
const MEAL_ORDER = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
};

const FilterBar = ({
  selectedItem,
  setSelectedItem,
  items,
  showFilterButton = false,
  useTimeOfDayDefault = false,
}: FilterBarProps) => {
  // Sort items based on meal order
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const orderA = MEAL_ORDER[a.title as keyof typeof MEAL_ORDER] || 999;
      const orderB = MEAL_ORDER[b.title as keyof typeof MEAL_ORDER] || 999;
      return orderA - orderB;
    });
  }, [items]);

  // When enabled, set default filter based on timeOfDay if none is selected.
  useEffect(() => {
    // If there's only one item, automatically select it
    if (items.length === 1 && !selectedItem) {
      setSelectedItem(items[0].id);
      return;
    }

    if (useTimeOfDayDefault && !selectedItem) {
      const tod = timeOfDay(new Date()); // 'morning', 'afternoon', or 'evening'
      let defaultFilter = '';

      if (tod === 'morning') defaultFilter = 'Breakfast';
      else if (tod === 'afternoon') defaultFilter = 'Lunch';
      else if (tod === 'evening') defaultFilter = 'Dinner';

      // Find item with matching title
      const matchingItem = items.find((item) => item.title === defaultFilter);

      if (matchingItem) {
        setSelectedItem(matchingItem.id);
      } else {
        // Fallback to first item if no match
        setSelectedItem(items[0]?.id || '');
      }
    }
  }, [items, selectedItem, useTimeOfDayDefault, setSelectedItem]);

  const onPressItem = async (id: string) => {
    setSelectedItem(id);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-1 flex-row items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2">
          {sortedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onPressItem(item.id)}
              className={cn(
                'self-start rounded-full p-2',
                selectedItem === item.id ? 'bg-ut-burnt-orange' : 'border border-ut-grey/75'
              )}>
              <Text
                className={cn(
                  'text-xs',
                  selectedItem === item.id ? 'font-bold text-white' : 'font-medium text-ut-grey/75'
                )}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showFilterButton && (
          <TouchableOpacity
            onPress={() => {
              SheetManager.show('filters');
            }}>
            <Filter size={18} color={COLORS['ut-grey']} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FilterBar;
