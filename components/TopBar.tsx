import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { ChefHat, ChevronLeft, Cog, Heart, Info, Map } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Platform } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Notifier } from 'react-native-notifier';

import Alert from './Alert';

import { isFavoriteItem, toggleFavorites } from '~/db/database';
import { useDatabase } from '~/hooks/useDatabase';
import { useFoodData } from '~/hooks/useFoodData';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useMealPlanStore } from '~/store/useMealPlanStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const icon = require('../assets/image.png');

const HomeTopBar = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <Image className="size-12" source={icon} />

      <View className="flex flex-row gap-x-5">
        {/* <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            NativeAlert.alert(
              'Coming Soon!',
              'Push notifications for your favorite food items will be available in an upcoming update.'
            );
          }}>
          <Bell size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/map');
          }}>
          <Map size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/meal-plan`);
          }}>
          <ChefHat size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/favorites`);
          }}>
          <Heart size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/settings');
          }}>
          <Cog size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LocationTopBar = () => {
  const { location } = useLocalSearchParams<{ location: string }>();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { locationData } = useLocationDetails(location);

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity
        className="flex flex-row items-center"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
        <Text className="text-lg font-semibold text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/meal-plan`);
          }}>
          <ChefHat size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/favorites`);
          }}>
          <Heart size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (!locationData) return; // Handle loading state

            SheetManager.show('location-about', {
              payload: {
                location: locationData,
              },
            });
          }}>
          <Info size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FoodTopBar = () => {
  const { category, food, location, menu, favorite } = useLocalSearchParams<{
    category: string;
    food: string;
    location: string;
    menu: string;
    favorite: string;
  }>();

  const { foodItem } = useFoodData(location, menu, category, food, favorite === 'true');
  const toggleMealPlanItem = useMealPlanStore((state) => state.toggleMealPlanItem);
  const isMealPlanItem = useMealPlanStore((state) => state.isMealPlanItem(food));
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const db = useDatabase();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const result = isFavoriteItem(db, foodItem?.name as string);

    setIsFavorite(result);
  }, [foodItem]);

  if (!foodItem) {
    return null;
  }

  const getIconColor = (isActive: boolean) => {
    if (isActive) return COLORS['ut-burnt-orange'];
    return isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey'];
  };

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity
        className="flex flex-row items-center"
        onPress={() => {
          router.back();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />

        <Text className="text-lg font-semibold text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>

      <View className="flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            if (foodItem) {
              toggleMealPlanItem({
                name: foodItem.name as string,
                locationName: location,
                categoryName: category,
                menuName: menu,
                allergens: Object.fromEntries(
                  Object.entries(foodItem.allergens).filter(([key]) => key !== 'id')
                ) as Record<string, boolean>,
                nutrition: {
                  calories: foodItem.nutrition?.calories || '0',
                  protein: foodItem.nutrition?.protein || '0',
                  total_carbohydrates: foodItem.nutrition?.total_carbohydrates || '0',
                },
              });

              if (isMealPlanItem) {
                Notifier.showNotification({
                  title: `${foodItem.name} removed from today's meal plan!`,
                  description: 'You removed this item from your meal plan.',
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              } else {
                Notifier.showNotification({
                  title: `${foodItem.name} added to today's meal plan!`,
                  description: 'You added this item to your meal plan.',
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              }
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}>
          <ChefHat
            size={20}
            color={getIconColor(isMealPlanItem)}
            fill={isMealPlanItem ? COLORS['ut-burnt-orange'] : 'transparent'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (foodItem) {
              if (isFavorite) {
                Notifier.showNotification({
                  title: `${foodItem.name} removed from Favorites!`,
                  description: 'You removed this item from your favorites.',
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              } else {
                Notifier.showNotification({
                  title: `${foodItem.name} added to Favorites!`,
                  description: 'You added this item to your Favorites.',
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              }

              const isFavorited = await toggleFavorites(db, foodItem, location, menu, category);
              setIsFavorite(isFavorited);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }}>
          <Heart
            size={20}
            color={getIconColor(isFavorite)}
            fill={isFavorite ? COLORS['ut-burnt-orange'] : 'transparent'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            SheetManager.show('food-info', {
              context: 'food',
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}>
          <Info size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BackTopBar = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity
        className="flex flex-row items-center"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />

        <Text className="text-lg font-semibold text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const GenericLocationTopBar = () => {
  const { location } = useLocalSearchParams<{ location: string }>();
  const { locationData } = useLocationDetails(location);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  if (!locationData) {
    return null;
  }

  return (
    <View
      className={cn(
        'flex w-full flex-row items-center justify-between  pb-4',
        isDarkMode ? 'bg-[#111827]' : 'bg-white'
      )}>
      <TouchableOpacity
        className="flex flex-row items-center"
        onPress={() => {
          router.back();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
        <Text className="text-lg font-semibold text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (Platform.OS === 'ios') {
              Linking.openURL(locationData.apple_maps_link);
            } else {
              Linking.openURL(locationData.google_maps_link);
            }
          }}>
          <Map size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface TopBarProps {
  variant?: 'home' | 'location' | 'back' | 'food' | 'generic-location';
}

const TopBar = ({ variant = 'home' }: TopBarProps) => {
  switch (variant) {
    case 'home':
      return <HomeTopBar />;
    case 'location':
      return <LocationTopBar />;
    case 'back':
      return <BackTopBar />;
    case 'food':
      return <FoodTopBar />;
    case 'generic-location':
      return <GenericLocationTopBar />;
    default:
      return <HomeTopBar />;
  }
};

export default TopBar;
