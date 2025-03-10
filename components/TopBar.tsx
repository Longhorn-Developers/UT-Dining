import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { Bell, ChefHat, ChevronLeft, Heart, Info, Map } from 'lucide-react-native';
import React from 'react';
import { View, Image, TouchableOpacity, Alert as NativeAlert, Text } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Notifier } from 'react-native-notifier';

import Alert from './Alert';

import { LOCATION_INFO } from '~/data/LocationInfo';
import { useFoodData } from '~/hooks/useFoodData';
import { useFavoritesStore } from '~/store/useFavoritesStore';
import { useMealPlanStore } from '~/store/useMealPlanStore';
import { COLORS } from '~/utils/colors';

const icon = require('../assets/image.png');

const HomeTopBar = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <Image className="size-12" source={icon} />

      <View className="flex flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            NativeAlert.alert(
              'Coming Soon!',
              'Push notifications for your favorite food items will be available in an upcoming update.'
            );
          }}>
          <Bell size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push(`/meal-plan`);
          }}>
          <ChefHat size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push(`/favorites`);
          }}>
          <Heart size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        {/* <TouchableOpacity>
          <Cog size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const LocationTopBar = () => {
  const { location } = useLocalSearchParams<{ location: string }>();

  const locationInfo = LOCATION_INFO.find((loc) => loc.name === location);

  if (!locationInfo) {
    return null;
  }

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity className="flex flex-row items-center" onPress={() => router.back()}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />

        <Text className="text-lg font-semibold text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(locationInfo.mapLink);
          }}>
          <Map size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push(`/meal-plan`);
          }}>
          <ChefHat size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push(`/favorites`);
          }}>
          <Heart size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            SheetManager.show('location-about', {
              payload: {
                location: locationInfo,
              },
            });
          }}>
          <Info size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FoodTopBar = () => {
  const { category, food, location, menu } = useLocalSearchParams<{
    category: string;
    food: string;
    location: string;
    menu: string;
  }>();

  const { foodItem } = useFoodData(location, menu, category, food);
  const toggleMealPlanItem = useMealPlanStore((state) => state.toggleMealPlanItem);
  const isMealPlanItem = useMealPlanStore((state) => state.isMealPlanItem(food));

  const isFavorite = useFavoritesStore((state) => state.isFavorite(food));
  const toggleFavoriteFoodItem = useFavoritesStore((state) => state.toggleFavoriteItem);

  if (!foodItem) {
    return null;
  }

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity className="flex flex-row items-center" onPress={() => router.back()}>
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
          }}>
          <ChefHat
            size={20}
            color={isMealPlanItem ? COLORS['ut-burnt-orange'] : COLORS['ut-grey']}
            fill={isMealPlanItem ? COLORS['ut-burnt-orange'] : 'white'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (foodItem) {
              toggleFavoriteFoodItem({
                name: foodItem.name as string,
                locationName: location,
                categoryName: category,
                menuName: menu,
              });

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
            }
          }}>
          <Heart
            size={20}
            color={isFavorite ? COLORS['ut-burnt-orange'] : COLORS['ut-grey']}
            fill={isFavorite ? COLORS['ut-burnt-orange'] : 'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            SheetManager.show('food-info');
          }}>
          <Info size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BackTopBar = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity className="flex flex-row items-center" onPress={() => router.back()}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />

        <Text className="text-lg font-semibold text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

interface TopBarProps {
  variant?: 'home' | 'location' | 'back' | 'food';
}

const BarComponent = {
  home: <HomeTopBar />,
  location: <LocationTopBar />,
  back: <BackTopBar />,
  food: <FoodTopBar />,
};

const TopBar = ({ variant = 'home' }: TopBarProps) => {
  return BarComponent[variant];
};

export default TopBar;
