import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  HeartIcon,
  ChefHatIcon,
  ChevronRight,
  Flame,
  BicepsFlexed,
  Wheat,
} from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Notifier } from 'react-native-notifier';

import Alert from './Alert';
import { FavoriteAction, RemoveAction, AddMealPlanAction } from './AnimatedActions';

import { ALLERGEN_ICONS } from '~/data/AllergenInfo';
import { FoodItem, useDataStore } from '~/store/useDataStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const FoodComponent = ({
  food,
  selectedMenu,
  categoryName,
  location,
  showFood = true,
}: {
  food: FoodItem;
  selectedMenu: string;
  categoryName: string;
  location: string;
  showFood?: boolean;
}) => {
  const { toggleFavoriteFoodItem, isFavoriteFoodItem, isMealPlanItem, toggleMealPlanItem } =
    useDataStore();
  const isFavorite = isFavoriteFoodItem(food.name as string);
  const isMealPlan = isMealPlanItem(food.name as string);

  return (
    <ReanimatedSwipeable
      containerStyle={{
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: COLORS['ut-burnt-orange'],
        display: showFood ? 'flex' : 'none',
      }}
      onSwipeableOpen={async (direction, swipeable) => {
        swipeable.close();

        if (direction === 'left') {
          await toggleMealPlanItem({
            ...food,
            categoryName,
            locationName: location,
            menuName: selectedMenu,
          });

          Notifier.showNotification({
            title: isMealPlan
              ? `${food.name} removed from today's meal plan!`
              : `${food.name} added to today's meal plan!`,
            description: isMealPlan
              ? 'You removed this item from your meal plan.'
              : 'Tap the chef hat (top right) to view your\nmeal plan for today.',
            swipeEnabled: true,
            Component: Alert,
            duration: 3000,
            queueMode: 'immediate',
          });
        } else {
          await toggleFavoriteFoodItem({
            ...food,
            categoryName,
            locationName: location,
            menuName: selectedMenu,
          });

          Notifier.showNotification({
            title: isFavorite
              ? `${food.name} removed from Favorites!`
              : `${food.name} added to Favorites!`,
            description: isFavorite
              ? 'You removed this item from your favorites.'
              : 'Tap the heart (top right) to view your saved favorites.',
            swipeEnabled: true,
            Component: Alert,
            duration: 3000,
            queueMode: 'immediate',
          });
        }
      }}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={50}
      rightThreshold={50}
      renderRightActions={(progress) =>
        isFavorite ? <RemoveAction progress={progress} /> : <FavoriteAction progress={progress} />
      }
      renderLeftActions={(progress) =>
        isMealPlan ? (
          <RemoveAction progress={progress} />
        ) : (
          <AddMealPlanAction progress={progress} />
        )
      }>
      <TouchableOpacity
        activeOpacity={1}
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: `/location/food/[food]`,
            params: {
              food: food.name as string,
              menu: selectedMenu,
              category: categoryName,
              location,
            },
          });
        }}
        className={cn(
          'flex-row items-center justify-between rounded border bg-white px-3 py-2',
          isFavorite || isMealPlan ? 'border-ut-burnt-orange' : 'border-ut-grey/15'
        )}>
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="line-clamp-2 max-w-[16rem] text-lg font-medium leading-6">
              {food.name}
            </Text>
            {isFavorite && (
              <HeartIcon
                fill={COLORS['ut-burnt-orange']}
                size={12}
                color={COLORS['ut-burnt-orange']}
              />
            )}
            {isMealPlan && <ChefHatIcon size={12} color={COLORS['ut-burnt-orange']} />}
          </View>
          <View className="flex flex-row gap-2">
            <View className="flex-row items-center gap-x-0.5">
              <Flame fill={COLORS['ut-burnt-orange']} size={10} color={COLORS['ut-burnt-orange']} />
              <Text className="text-xs font-medium">{food.nutrition?.calories} kcal</Text>
            </View>
            <View className="flex-row items-center gap-x-0.5">
              <BicepsFlexed
                fill={COLORS['ut-burnt-orange']}
                size={10}
                color={COLORS['ut-burnt-orange']}
              />
              <Text className="text-xs font-medium">{food.nutrition?.protein} Protein</Text>
            </View>
            <View className="flex-row items-center gap-x-0.5">
              <Wheat fill={COLORS['ut-burnt-orange']} size={10} color={COLORS['ut-burnt-orange']} />
              <Text className="text-xs font-medium">
                {food.nutrition?.total_carbohydrates} Carbs
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-1">
            {Object.entries(food.allergens || {}).map(
              ([key, value]) =>
                value && (
                  <Image
                    key={key}
                    source={ALLERGEN_ICONS[key]}
                    className="size-3 rounded-full"
                    resizeMode="contain"
                  />
                )
            )}
          </View>
        </View>
        <View className="flex-row items-center gap-x-1">
          <ChevronRight size={20} color={COLORS['ut-burnt-orange']} />
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
};

export default FoodComponent;
