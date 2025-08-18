import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  BicepsFlexed,
  ChefHatIcon,
  ChevronRight,
  Flame,
  HeartIcon,
  Wheat,
} from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Notifier } from 'react-native-notifier';
import Reanimated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ALLERGEN_ICONS } from '~/data/AllergenInfo';
import type { FoodItem } from '~/services/database/database';
import { useMealPlanStore } from '~/store/useMealPlanStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';
import Alert from './Alert';
import { AddMealPlanAction, FavoriteAction, RemoveAction } from './AnimatedActions';

const FoodComponent = ({
  food,
  selectedMenu,
  categoryName,
  location,
  onFavorite,
  isFavorite,
  isFavoriteScreen = false,
  showExtraInfo = true,
  canMealPlan = true,
}: {
  food: FoodItem;
  selectedMenu: string;
  categoryName: string;
  location: string;
  onFavorite: (food: FoodItem) => Promise<void>;
  isFavorite: boolean;
  isFavoriteScreen?: boolean; // If the component is rendered on the favorites screen
  showExtraInfo?: boolean;
  canMealPlan?: boolean;
}) => {
  const isMealPlan = useMealPlanStore((state) => state.isMealPlanItem(food.name as string));
  const toggleMealPlanItem = useMealPlanStore((state) => state.toggleMealPlanItem);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
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

  const handlePress = async () => {
    router.push({
      pathname: `/food/[food]`,
      params: {
        food: food.name as string,
        menu: selectedMenu,
        category: categoryName,
        location,
        favorite: isFavoriteScreen ? 'true' : 'false',
      },
    });
  };

  return (
    <Reanimated.View style={animatedStyle}>
      <ReanimatedSwipeable
        containerStyle={{
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 8,
          backgroundColor: COLORS['ut-burnt-orange'],
        }}
        shouldCancelWhenOutside
        enableTrackpadTwoFingerGesture
        // Add these properties to fix the gliding issue
        friction={1.5} // Higher friction reduces gliding
        overshootFriction={200} // Higher value means less overshoot
        animationOptions={{
          damping: 1, // Higher damping means less oscillation
          stiffness: 11, // Higher stiffness means faster snapping
          mass: 0.1, // Lower mass means faster settling
          restDisplacementThreshold: 0.005, // Small threshold for considering animation "done"
          restSpeedThreshold: 0.005, // Small threshold for considering animation "done"
        }}
        onSwipeableWillClose={() => {
          // Optional haptic feedback when closing
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
        onSwipeableOpen={async (direction, swipeable) => {
          swipeable.close();

          if (direction === 'left' && canMealPlan) {
            toggleMealPlanItem({
              name: food.name as string,
              locationName: location,
              categoryName,
              menuName: selectedMenu,
              allergens: Object.fromEntries(
                Object.entries(food.allergens || {}).filter(([key]) => key !== 'id'),
              ) as Record<string, boolean>,
              nutrition: {
                calories: food.nutrition?.calories || '',
                protein: food.nutrition?.protein || '',
                total_carbohydrates: food.nutrition?.total_carbohydrates || '',
              },
            });

            Notifier.showNotification({
              title: isMealPlan
                ? `${food.name} removed from today.`
                : `${food.name} saved for today!`,
              description: isMealPlan
                ? `You've updated your meal plan.`
                : `Added to today's meal plan.`,
              swipeEnabled: true,
              Component: Alert,
              duration: 3000,
              queueMode: 'immediate',
            });
          } else if (direction === 'right') {
            await onFavorite(food);
          }
        }}
        // Add these threshold properties to better define when an action is triggered
        overshootLeft={!canMealPlan}
        leftThreshold={canMealPlan ? 50 : Number.MAX_VALUE} // Higher threshold requires more decisive swipe
        rightThreshold={100} // Higher threshold requires more decisive swipe
        dragOffsetFromLeftEdge={canMealPlan ? 50 : Number.MAX_VALUE}
        renderRightActions={(progress) =>
          isFavorite ? <RemoveAction progress={progress} /> : <FavoriteAction progress={progress} />
        }
        renderLeftActions={(progress) =>
          canMealPlan ? (
            isMealPlan ? (
              <RemoveAction progress={progress} />
            ) : (
              <AddMealPlanAction progress={progress} />
            )
          ) : null
        }
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          className={cn(
            'flex-row items-center justify-between rounded border px-3 py-2',
            isDarkMode ? 'border-neutral-800 bg-neutral-800' : 'bg-white',
            isFavorite || isMealPlan ? 'border-ut-burnt-orange' : 'border-ut-grey/15',
          )}
        >
          <FoodContent
            food={food}
            isFavorite={isFavorite}
            isMealPlan={isMealPlan}
            showExtraInfo={showExtraInfo}
            isDarkMode={isDarkMode}
          />
        </Pressable>
      </ReanimatedSwipeable>
    </Reanimated.View>
  );
};

// Extract the food content into a separate component for reuse
const FoodContent = ({
  food,
  isFavorite,
  isMealPlan,
  showExtraInfo,
  isDarkMode,
}: {
  food: FoodItem;
  isFavorite: boolean;
  isMealPlan: boolean;
  showExtraInfo: boolean;
  isDarkMode: boolean;
}) => (
  <>
    <View className="gap-1">
      <View className="flex-row items-center gap-2">
        <Text
          className={cn(
            'line-clamp-2 max-w-[16rem] font-medium text-lg leading-6',
            isDarkMode ? 'text-white' : 'text-black',
          )}
        >
          {food.name}
        </Text>
        {isFavorite && showExtraInfo && (
          <HeartIcon fill={COLORS['ut-burnt-orange']} size={12} color={COLORS['ut-burnt-orange']} />
        )}
        {isMealPlan && showExtraInfo && <ChefHatIcon size={12} color={COLORS['ut-burnt-orange']} />}
      </View>

      {showExtraInfo && (
        <>
          <View className="flex flex-row gap-2">
            <View className="flex-row items-center gap-x-0.5">
              <Flame fill={COLORS['ut-burnt-orange']} size={10} color={COLORS['ut-burnt-orange']} />
              <Text
                className={cn(
                  'font-medium text-xs',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700',
                )}
              >
                {food.nutrition?.calories} kcal
              </Text>
            </View>
            <View className="flex-row items-center gap-x-0.5">
              <BicepsFlexed
                fill={COLORS['ut-burnt-orange']}
                size={10}
                color={COLORS['ut-burnt-orange']}
              />
              <Text
                className={cn(
                  'font-medium text-xs',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700',
                )}
              >
                {food.nutrition?.protein} Protein
              </Text>
            </View>
            <View className="flex-row items-center gap-x-0.5">
              <Wheat fill={COLORS['ut-burnt-orange']} size={10} color={COLORS['ut-burnt-orange']} />
              <Text
                className={cn(
                  'font-medium text-xs',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700',
                )}
              >
                {food.nutrition?.total_carbohydrates} Carbs
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-1">
            {food.allergens &&
              Object.entries(food.allergens).map(
                ([key, value]: [string, number | boolean | null]) =>
                  value === true ? (
                    <Image
                      key={key}
                      source={ALLERGEN_ICONS[key as keyof typeof ALLERGEN_ICONS]}
                      className="size-3 rounded-full"
                      resizeMode="contain"
                    />
                  ) : null,
              )}
          </View>
        </>
      )}
    </View>
    <View className="flex-row items-center gap-x-1">
      <ChevronRight size={20} color={isDarkMode ? '#fff' : COLORS['ut-burnt-orange']} />
    </View>
  </>
);

export default FoodComponent;
