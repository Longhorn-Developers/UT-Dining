import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  BicepsFlexed,
  ChefHatIcon,
  ChevronRight,
  CircleX,
  Droplet,
  Flame,
  HeartIcon,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View, ViewStyle, Image } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Notifier } from 'react-native-notifier';
import Reanimated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import Alert from './Alert';

import { ALLERGEN_ICONS } from '~/data/AllergenInfo';
import { FoodItem, useDataStore } from '~/store/useDataStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const Favorite = (
  progressAnimatedValue: SharedValue<number>,
  dragAnimatedValue: SharedValue<number>,
  swipeable: SwipeableMethods
) => {
  const heartAnimation = useAnimatedStyle<ViewStyle>(() => {
    const translateXValue = interpolate(
      progressAnimatedValue.value,
      [0, 1],
      [50, -20],
      Extrapolation.CLAMP
    );

    const scaleValue = interpolate(
      progressAnimatedValue.value,
      [0, 1],
      [0.4, 1.2],
      Extrapolation.CLAMP
    );

    const opacityValue = interpolate(
      progressAnimatedValue.value,
      [0, 0.2, 1],
      [0, 1, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          scale: withTiming(scaleValue, { duration: 300, easing: Easing.out(Easing.exp) }),
        },
        {
          translateX: withTiming(translateXValue, {
            duration: 300,
            easing: Easing.out(Easing.exp),
          }),
        },
      ],
      opacity: withTiming(opacityValue, { duration: 300 }),
    };
  });

  const backgroundAnimation = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: interpolateColor(
        progressAnimatedValue.value,
        [0, 0.8, 1],
        ['white', COLORS['ut-burnt-orange'], COLORS['ut-burnt-orange']]
      ),
    };
  });

  return (
    <Reanimated.View
      style={backgroundAnimation}
      className="min-w-[6.5rem] flex-row items-center justify-end pr-4">
      <Reanimated.View style={heartAnimation}>
        <HeartIcon fill="#fff" stroke="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
};

const UnFavorite = (
  progressAnimatedValue: SharedValue<number>,
  dragAnimatedValue: SharedValue<number>,
  swipeable: SwipeableMethods
) => {
  const heartAnimation = useAnimatedStyle<ViewStyle>(() => {
    const translateXValue = interpolate(
      progressAnimatedValue.value,
      [0, 1],
      [50, -20],
      Extrapolation.CLAMP
    );

    const scaleValue = interpolate(
      progressAnimatedValue.value,
      [0, 1],
      [0.4, 1.2],
      Extrapolation.CLAMP
    );

    const opacityValue = interpolate(
      progressAnimatedValue.value,
      [0, 0.2, 1],
      [0, 1, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          scale: withTiming(scaleValue, { duration: 300, easing: Easing.out(Easing.exp) }),
        },
        {
          translateX: withTiming(translateXValue, {
            duration: 300,
            easing: Easing.out(Easing.exp),
          }),
        },
      ],
      opacity: withTiming(opacityValue, { duration: 300 }),
    };
  });

  const backgroundAnimation = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: interpolateColor(
        progressAnimatedValue.value,
        [0, 0.8, 1],
        ['white', COLORS['ut-burnt-orange'], COLORS['ut-burnt-orange']]
      ),
    };
  });

  return (
    <Reanimated.View
      style={backgroundAnimation}
      className="min-w-[6.5rem] flex-row items-center justify-end pr-4">
      <Reanimated.View style={heartAnimation}>
        <CircleX stroke="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
};

const MealPrep = (
  progressAnimatedValue: SharedValue<number>,
  dragAnimatedValue: SharedValue<number>,
  swipeable: SwipeableMethods
) => {
  const heartAnimation = useAnimatedStyle<ViewStyle>(() => {
    const translateXValue = interpolate(
      progressAnimatedValue.value,
      [0, 1],
      [-110, -20],
      Extrapolation.CLAMP
    );

    const scaleValue = interpolate(
      progressAnimatedValue.value,
      [0, 1],
      [0.4, 1.2],
      Extrapolation.CLAMP
    );

    const opacityValue = interpolate(
      progressAnimatedValue.value,
      [0, 0.2, 1],
      [0, 1, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          scale: withTiming(scaleValue, { duration: 300, easing: Easing.out(Easing.exp) }),
        },
        {
          translateX: withTiming(translateXValue, {
            duration: 300,
            easing: Easing.out(Easing.exp),
          }),
        },
      ],
      opacity: withTiming(opacityValue, { duration: 300 }),
    };
  });

  const backgroundAnimation = useAnimatedStyle<ViewStyle>(() => {
    return {
      backgroundColor: interpolateColor(
        progressAnimatedValue.value,
        [0, 0.8, 1],
        ['white', COLORS['ut-burnt-orange'], COLORS['ut-burnt-orange']]
      ),
    };
  });

  return (
    <Reanimated.View
      style={backgroundAnimation}
      className="min-w-[6.5rem] flex-row items-center justify-end pr-4">
      <Reanimated.View style={heartAnimation}>
        <ChefHatIcon fill="#fff" stroke="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
};

const FoodComponent = ({
  food,
  selectedMenu,
  categoryName,
  location,
}: {
  food: FoodItem;
  selectedMenu: string;
  categoryName: string;
  location: string;
}) => {
  const { toggleFavoriteFoodItem, isFavoriteFoodItem } = useDataStore();
  const allergenData = Object.entries(food.allergens || {});
  const isFavorite = isFavoriteFoodItem(food.name as string);

  return (
    <ReanimatedSwipeable
      containerStyle={{
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: COLORS['ut-burnt-orange'],
      }}
      onSwipeableOpen={(direction, swipable) => {
        swipable.close();

        if (direction === 'left') {
          Notifier.showNotification({
            title: `${food.name} added to today's meal plan!`,
            description: 'Tap the chef hat (top right) to view your\nmeal plan for today.',
            swipeEnabled: true,
            Component: Alert,
            duration: 3000,
            queueMode: 'immediate',
          });
        } else {
          if (isFavorite) {
            Notifier.showNotification({
              title: `${food.name} removed from Favorites!`,
              description: 'You removed this item from your favorites.',
              swipeEnabled: true,
              Component: Alert,
              duration: 3000,
              queueMode: 'immediate',
            });
          } else {
            Notifier.showNotification({
              title: `${food.name} added to Favorites!`,
              description: 'Tap the heart (top right) to view your saved favorites.',
              swipeEnabled: true,
              Component: Alert,
              duration: 3000,
              queueMode: 'immediate',
            });
          }

          // To ensure the animation is complete before updating the state
          setTimeout(() => {
            toggleFavoriteFoodItem({
              ...food,
              categoryName,
              locationName: location,
              menuName: selectedMenu,
            });
          }, 200);
        }
      }}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={50}
      rightThreshold={50}
      renderRightActions={isFavorite ? UnFavorite : Favorite}
      renderLeftActions={MealPrep}>
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
          isFavorite ? 'border-ut-burnt-orange' : 'border-ut-grey/15'
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
          </View>
          <View className="flex flex-row gap-2 ">
            <View className="flex-row items-center gap-x-0.5">
              <Flame fill={COLORS['ut-burnt-orange']} size={10} color={COLORS['ut-burnt-orange']} />
              <Text className="text-xs font-medium">{food.nutrition?.calories} kCal</Text>
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
              <Droplet
                fill={COLORS['ut-burnt-orange']}
                size={10}
                color={COLORS['ut-burnt-orange']}
              />
              <Text className="text-xs font-medium">{food.nutrition?.total_fat} Fat</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-1">
            {allergenData.map(
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
