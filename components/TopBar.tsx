import * as Haptics from 'expo-haptics';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ChefHat, ChevronLeft, Heart, Info, MessageSquare } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Notifier } from 'react-native-notifier';
import { useDatabase } from '~/hooks/useDatabase';
import { useFoodData } from '~/hooks/useFoodData';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { isFavoriteItem, toggleFavorites } from '~/services/database/database';
import { useMealPlanStore } from '~/store/useMealPlanStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import Alert from './Alert';

const icon = require('../assets/image.png');

const HomeTopBar = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  return (
    <View className="flex w-full flex-row items-center justify-between ">
      <Image className="size-12" source={icon} />

      <View className="flex flex-row gap-x-5">
        <Link href="https://utdining.userjot.com/" asChild>
          <TouchableOpacity>
            <MessageSquare
              size={20}
              color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']}
            />
          </TouchableOpacity>
        </Link>
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
        }}
      >
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
        <Text className="font-semibold text-lg text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-x-5">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/favorites`);
          }}
        >
          <Heart size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/meal-plan`);
          }}
        >
          <ChefHat size={20} color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']} />
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
          }}
        >
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
  }, [foodItem, db]);

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
        }}
      >
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />

        <Text className="font-semibold text-lg text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>

      <View className="flex-row gap-x-5">
        <TouchableOpacity
          onPress={async () => {
            if (foodItem) {
              if (isFavorite) {
                Notifier.showNotification({
                  title: `${foodItem.name} removed.`,
                  description: `No longer in Favorites.`,
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              } else {
                Notifier.showNotification({
                  title: `${foodItem.name} added!`,
                  description: `Added to Favorites.`,
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
          }}
        >
          <Heart
            size={20}
            color={getIconColor(isFavorite)}
            fill={isFavorite ? COLORS['ut-burnt-orange'] : 'transparent'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (foodItem) {
              toggleMealPlanItem({
                name: foodItem.name as string,
                locationName: location,
                categoryName: category,
                menuName: menu,
                allergens: Object.fromEntries(
                  Object.entries(foodItem.allergens || {}).filter(([key]) => key !== 'id'),
                ) as Record<string, boolean>,
                nutrition: {
                  calories: foodItem.nutrition?.calories || '0',
                  protein: foodItem.nutrition?.protein || '0',
                  total_carbohydrates: foodItem.nutrition?.total_carbohydrates || '0',
                },
              });

              if (isMealPlanItem) {
                Notifier.showNotification({
                  title: `${foodItem.name} removed from today.`,
                  description: `You've updated your meal plan.`,
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              } else {
                Notifier.showNotification({
                  title: `${foodItem.name} saved for today!`,
                  description: `Added to today's meal plan.`,
                  swipeEnabled: true,
                  Component: Alert,
                  duration: 3000,
                  queueMode: 'immediate',
                });
              }
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <ChefHat
            size={20}
            color={getIconColor(isMealPlanItem)}
            fill={isMealPlanItem ? COLORS['ut-burnt-orange'] : 'transparent'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            SheetManager.show('food-info', {
              context: 'food',
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
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
        }}
      >
        <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />

        <Text className="font-semibold text-lg text-ut-burnt-orange">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

interface TopBarProps {
  variant?: 'home' | 'location' | 'back' | 'food';
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
    default:
      return <HomeTopBar />;
  }
};

export default TopBar;
