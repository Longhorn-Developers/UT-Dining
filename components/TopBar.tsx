import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { Bell, ChefHat, ChevronLeft, Cog, Heart, Info, Map } from 'lucide-react-native';
import React from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { LOCATION_INFO } from '~/data/LocationInfo';
import { COLORS } from '~/utils/colors';

const icon = require('../assets/image.png');

const HomeTopBar = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <Image className="size-12" source={icon} />

      <View className="flex flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Coming Soon!',
              'Push notifications for your favorite food items will be available in an upcoming update.'
            );
          }}>
          <Bell size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Coming Soon!',
              'The meal planner feature will be available in an upcoming update.'
            );
          }}>
          <ChefHat size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Alert.alert(
            //   'Coming Soon!',
            //   'The favorites feature will be available in an upcoming update.'
            // );

            router.push(`/favorites`);
          }}>
          <Heart size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Cog size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>
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
            Alert.alert(
              'Coming Soon!',
              'The meal planner feature will be available in an upcoming update.'
            );
          }}>
          <ChefHat size={20} color={COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Alert.alert(
            //   'Coming Soon!',
            //   'The favorites feature will be available in an upcoming update.'
            // );
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

interface TopBarProps {
  variant?: 'home' | 'location';
}

const BarComponent = {
  home: <HomeTopBar />,
  location: <LocationTopBar />,
};

const TopBar = ({ variant = 'home' }: TopBarProps) => {
  return BarComponent[variant];
};

export default TopBar;
