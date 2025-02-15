import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { Bell, ChefHat, ChevronLeft, Cog, Heart, Info, Map } from 'lucide-react-native';
import React from 'react';
import { View, Image, TouchableOpacity, Alert as NativeAlert } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Notifier } from 'react-native-notifier';

import Alert from './Alert';

import { LOCATION_INFO } from '~/data/LocationInfo';
import { useDataStore } from '~/store/useDataStore';
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
            NativeAlert.alert(
              'Coming Soon!',
              'The meal planner feature will be available in an upcoming update.'
            );
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
      <TouchableOpacity className="flex items-center" onPress={() => router.back()}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
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
            NativeAlert.alert(
              'Coming Soon!',
              'The meal planner feature will be available in an upcoming update.'
            );
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

  const { toggleFavoriteFoodItem, getFoodItem, isFavoriteFoodItem } = useDataStore();

  const foodItem = getFoodItem(location, menu, category, food);

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity className="flex items-center" onPress={() => router.back()}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
      </TouchableOpacity>

      <View className="flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            if (foodItem) {
              if (isFavoriteFoodItem(food)) {
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
                  description: 'You added this item to your favorites.',
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              }

              setTimeout(() => {
                toggleFavoriteFoodItem({
                  ...foodItem,
                  categoryName: category,
                  locationName: location,
                  menuName: menu,
                });
              }, 200);
            }
          }}>
          <Heart
            size={20}
            color={isFavoriteFoodItem(food) ? COLORS['ut-burnt-orange'] : COLORS['ut-grey']}
            fill={isFavoriteFoodItem(food) ? COLORS['ut-burnt-orange'] : 'white'}
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

const FavoritesTopBar = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <TouchableOpacity className="flex items-center" onPress={() => router.back()}>
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
      </TouchableOpacity>
    </View>
  );
};

interface TopBarProps {
  variant?: 'home' | 'location' | 'favorites' | 'food';
}

const BarComponent = {
  home: <HomeTopBar />,
  location: <LocationTopBar />,
  favorites: <FavoritesTopBar />,
  food: <FoodTopBar />,
};

const TopBar = ({ variant = 'home' }: TopBarProps) => {
  return BarComponent[variant];
};

export default TopBar;
