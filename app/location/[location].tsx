import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  BicepsFlexed,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplet,
  Filter,
  Flame,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import { ALLERGEN_ICONS } from '~/data/AllergenInfo';
import { FoodItem, MenuCategory, useDataStore } from '~/store/useDataStore';
import { COLORS } from '~/utils/colors';
import { generateSchedule, isLocationOpen } from '~/utils/time';
import { cn } from '~/utils/utils';

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

  return (
    <TouchableOpacity
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
        'mb-2 flex-row items-center justify-between rounded border border-ut-grey/15 px-3 py-2'
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
            <Droplet fill={COLORS['ut-burnt-orange']} size={10} color={COLORS['ut-burnt-orange']} />
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
                        <Text className="text-sm leading-none text-ut-grey">{item.dayRange}:</Text>
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

                {data.menu.length > 1 && (
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
                )}
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
            return <MenuItem selectedFilter={selectedFilter} menuCategories={menu.menu_category} />;
          }}
        />
      </Container>
    </>
  );
};

export default Location;
