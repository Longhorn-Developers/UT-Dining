import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  BicepsFlexed,
  ChefHatIcon,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplet,
  Filter,
  Flame,
  HeartIcon,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Notifier } from 'react-native-notifier';
import Reanimated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import { ALLERGEN_ICONS } from '~/data/AllergenInfo';
import { FoodItem, MenuCategory, useDataStore } from '~/store/useDataStore';
import { COLORS } from '~/utils/colors';
import { generateSchedule, isLocationOpen } from '~/utils/time';
import { cn } from '~/utils/utils';

const RightActions = (
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

const LeftActions = (
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

const CustomNotification = ({ title, description }: { title: string; description: string }) => (
  <SafeAreaView className="px-4">
    <View className="flex-row items-center gap-x-3 rounded-lg border border-ut-grey/25 bg-white p-4 pr-12">
      <View className="h-full w-1 rounded-full bg-ut-burnt-orange" />

      <View className="gap-y-1">
        <Text className="text-lg font-bold leading-snug">{title}</Text>
        <Text className="text-sm">{description}</Text>
      </View>
    </View>
  </SafeAreaView>
);

const FoodComponent = ({
  food,
  selectedFilter,
  categoryName,
  location,
}: {
  food: FoodItem;
  selectedFilter: string;
  categoryName: string;
  location: string;
}) => {
  const allergenData = Object.entries(food.allergens || {});
  const ref = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      containerStyle={{
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: COLORS['ut-burnt-orange'],
      }}
      ref={ref}
      friction={3}
      onSwipeableWillOpen={(direction) => {
        if (direction === 'left') {
          Notifier.showNotification({
            title: `${food.name} added to today's meal plan!`,
            description: 'Tap the chef hat (top right) to view your\nmeal plan for today.',
            swipeEnabled: true,
            Component: CustomNotification,
            duration: 3000,
            queueMode: 'immediate',
          });
        } else {
          Notifier.showNotification({
            title: `${food.name} added to Favorites!`,
            description: 'Tap the heart (top right) to view your saved favorites.',
            swipeEnabled: true,
            Component: CustomNotification,
            duration: 3000,
            queueMode: 'immediate',
          });
        }
        ref.current?.close();
      }}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={50}
      rightThreshold={50}
      renderRightActions={RightActions}
      renderLeftActions={LeftActions}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          router.push({
            pathname: `/location/food/[food]`,
            params: {
              food: food.name as string,
              menu: selectedFilter,
              category: categoryName,
              location,
            },
          });
        }}
        className={cn(
          'flex-row items-center justify-between rounded border border-ut-grey/15 bg-white px-3 py-2'
        )}>
        <View className="gap-1">
          <Text className="line-clamp-2 max-w-[16rem] text-lg font-medium leading-6">
            {food.name}
          </Text>
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

const MenuCategoryItem = ({
  categoryName,
  foodItems,
  selectedFilter,
}: {
  categoryName: string;
  foodItems: FoodItem[];
  selectedFilter: string;
}) => {
  const [showFood, setShowFood] = useState(true);
  const { location } = useLocalSearchParams();

  return (
    <View className="my-4 flex-col px-6">
      <TouchableOpacity
        onPress={() => {
          setShowFood(!showFood);
        }}
        className="mb-3 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">{categoryName}</Text>

        <View
          className={cn(
            'transition-transform duration-200 ease-in-out',
            showFood ? 'rotate-180 transform' : 'rotate-0'
          )}>
          <ChevronDown size={20} color={COLORS['ut-grey']} />
        </View>
      </TouchableOpacity>

      {showFood && (
        <FlashList
          data={foodItems}
          estimatedItemSize={15}
          renderItem={({ item: food }) => (
            <FoodComponent
              food={food}
              selectedFilter={selectedFilter}
              categoryName={categoryName}
              location={location as string}
            />
          )}
        />
      )}
    </View>
  );
};

const MenuItem = ({
  menuCategories,
  selectedFilter,
}: {
  menuCategories: MenuCategory[];
  selectedFilter: string;
}) => {
  return (
    <>
      {menuCategories.map((menuCategory: MenuCategory) => (
        <MenuCategoryItem
          key={menuCategory.title}
          categoryName={menuCategory.title as string}
          foodItems={menuCategory.food_item}
          selectedFilter={selectedFilter}
        />
      ))}
    </>
  );
};

const Location = () => {
  const {
    location,
  }: {
    location: string;
  } = useLocalSearchParams();
  const { getLocationData } = useDataStore();
  const data = getLocationData(location);

  const [selectedFilter, setSelectedFilter] = useState(data?.menu[0]?.name || '');
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  if (!data) {
    router.back();
    return null;
  }

  const filteredData = data.menu.filter((menu) => {
    return menu.name === selectedFilter;
  });

  const schedule = generateSchedule(location);

  return (
    <>
      <Stack.Screen options={{ title: 'Location' }} />
      <Container className="mx-0">
        <GestureHandlerRootView>
          <FlashList
            data={filteredData}
            estimatedItemSize={5}
            ListHeaderComponent={
              <View className="mx-6 mt-6 flex gap-y-5">
                <TopBar variant="location" />
                <View className="gap-y-4">
                  <View>
                    <View className="w-full flex-row items-center justify-between">
                      <Text className="font-sans text-3xl font-extrabold">{location}</Text>
                    </View>
                    <Text className="text-lg font-semibold text-ut-burnt-orange">
                      {isLocationOpen(location) ? 'Open' : 'Closed'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setTimeDropdownOpen(!timeDropdownOpen);
                    }}
                    className="flex flex-row items-start gap-4">
                    {/* Left Column: Day Ranges */}
                    <View className="flex flex-col gap-1.5">
                      {(timeDropdownOpen ? schedule : schedule.slice(0, 1)).map((item, index) => (
                        <View key={item.dayRange} className="flex flex-row gap-2">
                          {/* Show Clock icon only for the first item */}
                          <View className={index === 0 ? 'flex' : 'invisible'}>
                            <Clock size={12} color={COLORS['ut-grey']} />
                          </View>
                          <Text className="text-sm leading-none text-ut-grey">
                            {item.dayRange}:
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Right Column: Times */}
                    <View className="flex flex-col gap-1.5">
                      {(timeDropdownOpen ? schedule : schedule.slice(0, 1)).map((item, index) => (
                        <View key={item.dayRange} className="flex flex-row gap-2">
                          <Text key={index} className={cn('text-sm leading-none text-ut-grey')}>
                            {item.time}
                          </Text>

                          {index === 0 && (
                            <View
                              className={cn(
                                'transition-transform duration-200 ease-in-out',
                                timeDropdownOpen ? 'rotate-180 transform' : 'rotate-0'
                              )}>
                              <ChevronDown size={12} color={COLORS['ut-grey']} />
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>

                  <View className="my-1 w-full border-b border-b-ut-grey/15" />

                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerClassName="gap-x-2">
                        {data.menu.map((item) => (
                          <TouchableOpacity
                            onPress={() => setSelectedFilter(item.name as string)}
                            key={item.name}
                            className={cn(
                              'self-start rounded-full p-2',
                              selectedFilter === item.name
                                ? 'bg-ut-burnt-orange'
                                : 'border border-ut-grey/75'
                            )}>
                            <Text
                              className={cn(
                                'text-xs',
                                selectedFilter === item.name
                                  ? 'font-bold text-white'
                                  : 'font-medium text-ut-grey/75'
                              )}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    <View className="pl-2">
                      <TouchableOpacity>
                        <Filter size={20} color={COLORS['ut-grey']} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View className="mt-12 flex-1 items-center justify-center">
                <Text className="text-xl font-medium text-ut-burnt-orange">No items found.</Text>
                <Text className="text-sm">Please try again later.</Text>
              </View>
            }
            renderItem={({ item: menu }) => {
              return (
                <MenuItem selectedFilter={selectedFilter} menuCategories={menu.menu_category} />
              );
            }}
          />
        </GestureHandlerRootView>
      </Container>
    </>
  );
};

export default Location;
