import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChefHat, Heart, LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { FilterType } from '../(tabs)';
import * as schema from '../../services/database/schema';

import FilterBar from '~/components/FilterBar';
import TopBar from '~/components/TopBar';
import { useSettingsStore } from '~/store/useSettingsStore';
import { getColor } from '~/utils/colors';
import { timeOfDay } from '~/utils/time';
import { cn } from '~/utils/utils';

type HomeHeaderProps = {
  currentTime: Date;
  selectedFilter: string;
  setSelectedFilter: (filter: FilterType) => void;
  locationTypes: schema.LocationType[];
};

interface QuickLinksCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  onPress: () => void;
  isDarkMode: boolean;
}

const QuickLinksCard = ({ title, description, Icon, onPress, isDarkMode }: QuickLinksCardProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    opacity.value = withSpring(0.8, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Reanimated.View
      className={cn(
        'flex-1  rounded-lg px-2 py-3',
        isDarkMode ? 'bg-gray-800' : 'border border-gray-200 bg-white',
        'shadow-sm'
      )}
      style={animatedStyle}>
      <Pressable
        className="flex-row items-center"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}>
        <View
          className={cn(
            'mr-3 h-10 w-10 items-center justify-center rounded-full',
            isDarkMode ? 'bg-gray-700' : 'bg-orange-100'
          )}>
          <Icon size={20} color={getColor('ut-burnt-orange', false)} />
        </View>
        <View className="flex-1">
          <Text className={cn('text-sm font-bold', isDarkMode ? 'text-gray-100' : 'text-gray-800')}>
            {title}
          </Text>
          <Text className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
            {description}
          </Text>
        </View>
      </Pressable>
    </Reanimated.View>
  );
};

const HomeHeader = ({
  currentTime,
  selectedFilter,
  setSelectedFilter,
  locationTypes,
}: HomeHeaderProps) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  // Generate filter items dynamically from location types, sorted by display_order
  const filterItems = [
    { id: 'all', title: 'All' },
    ...locationTypes
      .sort((a, b) => a.display_order - b.display_order)
      .map((type) => ({
        id: type.name,
        title: type.name,
      })),
  ];

  const getGreetingMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 11) {
      return 'Good Morning! ☀️';
    } else if (hour < 18) {
      return 'Good Afternoon! 🌤️';
    } else {
      return 'Good Evening! 🌙';
    }
  };

  const getSubtitleMessage = () => {
    switch (timeOfDay(currentTime)) {
      case 'morning':
        return 'Breakfast is served.';
      case 'afternoon':
        return 'Lunch is served.';
      case 'evening':
        return 'Dinner is served.';
      default:
        return '';
    }
  };

  return (
    <View className="mt-6 flex gap-y-5">
      <TopBar />

      <View className="gap-y-4">
        <View>
          <Text
            className={cn(
              'font-sans text-3xl font-extrabold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
            {getGreetingMessage()}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className={cn('font-medium', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              {getSubtitleMessage()}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <QuickLinksCard
            title="Favorites"
            description="Your saved meals"
            Icon={Heart}
            isDarkMode={isDarkMode}
            onPress={() => {
              router.push('/favorites');
            }}
          />
          <QuickLinksCard
            title="Meal Plan"
            description="Your planned meals"
            Icon={ChefHat}
            isDarkMode={isDarkMode}
            onPress={() => {
              router.push('/meal-plan');
            }}
          />
        </View>

        <FilterBar
          selectedItem={selectedFilter}
          setSelectedItem={setSelectedFilter}
          items={filterItems}
        />
      </View>
    </View>
  );
};

export default HomeHeader;
