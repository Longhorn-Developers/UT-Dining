import * as Haptics from 'expo-haptics';
import { Filter } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import type { FilterType } from '~/app/(tabs)';
import { useFiltersStore } from '~/store/useFiltersStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import type { MealTimes } from '~/utils/locations';
import { timeOfDay } from '~/utils/time';
import { cn } from '~/utils/utils';

type FilterBarProps = {
  selectedItem: string;
  setSelectedItem: (item: FilterType) => void;
  items: { id: string; title: string }[]; // Accepts dynamic items array
  mealTimes?: MealTimes;
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
  items: filterItems,
  mealTimes,
  showFilterButton = false,
  useTimeOfDayDefault = false,
}: FilterBarProps) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  // Sort items based on meal order
  const sortedItems = useMemo(() => {
    return [...filterItems].sort((a, b) => {
      const orderA = MEAL_ORDER[a.title as keyof typeof MEAL_ORDER] || 999;
      const orderB = MEAL_ORDER[b.title as keyof typeof MEAL_ORDER] || 999;
      return orderA - orderB;
    });
  }, [filterItems]);

  // When enabled, set default filter based on timeOfDay if none is selected.
  useEffect(() => {
    // If there's only one item, automatically select it
    if (filterItems.length === 1 && !selectedItem) {
      setSelectedItem(filterItems[0].id as FilterType);
      return;
    }

    if (useTimeOfDayDefault && !selectedItem) {
      const tod = mealTimes ? timeOfDay(new Date(), mealTimes) : timeOfDay(new Date());
      let defaultFilter = '';

      if (tod === 'morning') defaultFilter = 'Breakfast';
      else if (tod === 'afternoon') defaultFilter = 'Lunch';
      else if (tod === 'evening') defaultFilter = 'Dinner';

      // Find item with matching title
      const matchingItem = filterItems.find((item) => item.title === defaultFilter);

      if (matchingItem) {
        setSelectedItem(matchingItem.id as FilterType);
      } else {
        // Fallback to first item if no match
        setSelectedItem(filterItems[0]?.id as FilterType);
      }
    }
  }, [filterItems, selectedItem, useTimeOfDayDefault, setSelectedItem, mealTimes]);

  const onPressItem = async (id: FilterType) => {
    setSelectedItem(id as FilterType);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-1 flex-row items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2"
        >
          {sortedItems.map((item) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={item.id}
              onPress={() => onPressItem(item.id as FilterType)}
              className={cn(
                'self-start rounded-full px-3 py-1',
                selectedItem === item.id
                  ? 'border-ut-burnt-orange bg-ut-burnt-orange text-white'
                  : isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-gray-200'
                    : 'border border-gray-200 bg-white text-ut-grey',
              )}
            >
              <Text
                className={cn(
                  'text-xs',
                  selectedItem === item.id
                    ? 'font-bold text-white'
                    : isDarkMode
                      ? 'font-medium text-gray-200'
                      : 'font-medium text-ut-grey/75',
                )}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showFilterButton && <FilterButton />}
      </View>
    </View>
  );
};

const FilterButton = () => {
  const filters = useFiltersStore((state) => state.filters);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  // If there are any filters, make this true
  const hasFilters = () => {
    const hasValues = <T extends Record<string, boolean>>(item: T): boolean =>
      Array.isArray(item) ? item.length > 0 : Object.values(item).some(Boolean);

    return (
      filters.favorites ||
      filters.mealPlan ||
      hasValues(filters.dietary) ||
      hasValues(filters.allergens)
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        SheetManager.show('filters');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <Filter size={18} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />

      {hasFilters() && (
        <View className="-mr-2 -mt-2 absolute top-0 right-0">
          <View className="size-2 rounded-full bg-ut-burnt-orange" />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default FilterBar;
