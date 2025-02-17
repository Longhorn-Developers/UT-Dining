import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { timeOfDay } from '~/utils/time';
import { cn } from '~/utils/utils';

type FilterBarProps = {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  items: { id: string; title: string }[]; // Accepts dynamic items array
  useTimeOfDayDefault?: boolean;
};

const FilterBar = ({
  selectedItem,
  setSelectedItem,
  items,
  useTimeOfDayDefault = false,
}: FilterBarProps) => {
  // When enabled, set default filter based on timeOfDay if none is selected.
  useEffect(() => {
    if (useTimeOfDayDefault) {
      const tod = timeOfDay(new Date()); // 'morning', 'afternoon', or 'evening'
      let defaultFilter = '';
      if (tod === 'morning') defaultFilter = 'Breakfast';
      else if (tod === 'afternoon') defaultFilter = 'Lunch';
      else if (tod === 'evening') defaultFilter = 'Dinner';

      if (defaultFilter && items.some((item) => item.title.includes(defaultFilter))) {
        setSelectedItem(defaultFilter);
      } else {
        setSelectedItem(items[0].id);
      }
    }
  }, []);

  const onPressItem = async (id: string) => {
    setSelectedItem(id);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2">
          {items.map((item) => (
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
      </View>
      {/* Uncomment if needed */}
      {/* <View className="pl-2">
          <TouchableOpacity>
            <Filter size={20} color={COLORS['ut-grey']} />
          </TouchableOpacity>
        </View> */}
    </View>
  );
};

export default FilterBar;
