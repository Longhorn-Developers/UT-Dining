import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Container } from '~/components/Container';
import FoodComponent from '~/components/FoodComponent';
import TopBar from '~/components/TopBar';
import { useDataStore } from '~/store/useDataStore';

const MealPlan = () => {
  const { mealPlanItems } = useDataStore();

  const totalCalories = mealPlanItems.reduce(
    (sum, item) => sum + parseFloat(String(item.nutrition?.calories || 0)),
    0
  );
  const totalProtein = mealPlanItems.reduce(
    (sum, item) => sum + parseFloat(String(item.nutrition?.protein || 0)),
    0
  );
  const totalFat = mealPlanItems.reduce(
    (sum, item) => sum + parseFloat(String(item.nutrition?.total_fat || 0)),
    0
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Meal Plan',
        }}
      />
      <Container className="m-0">
        <FlatList
          ListHeaderComponent={
            <View className="flex gap-y-5 bg-white py-6">
              <TopBar variant="back" />
              <View>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-3xl font-extrabold">Your Meal Plan</Text>
                </View>
                <Text className="font-medium text-ut-grey">
                  To add to meal plan, swipe right on a food item!
                </Text>
                <Text className="mt-2 text-sm text-ut-grey">
                  <Text className="font-bold text-ut-burnt-orange">Note: </Text>
                  Your meal plan will reset at the end of the day.
                </Text>
              </View>

              <View className="flex-row justify-around rounded-lg border border-ut-grey/15 bg-white p-4">
                <View className="flex-1 items-center">
                  <Text className="text-lg font-bold text-ut-burnt-orange">
                    {totalCalories} kCal
                  </Text>
                  <Text className="text-xs font-medium text-ut-grey">Calories</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-lg font-bold text-ut-burnt-orange">
                    {totalProtein.toFixed(1)}g
                  </Text>
                  <Text className="text-xs font-medium text-ut-grey">Protein</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-lg font-bold text-ut-burnt-orange">
                    {totalFat.toFixed(1)}g
                  </Text>
                  <Text className="text-xs font-medium text-ut-grey">Fat</Text>
                </View>
              </View>

              <View className="my-1 w-full border-b border-b-ut-grey/15" />
            </View>
          }
          data={mealPlanItems}
          contentContainerClassName="px-6"
          renderItem={({ item }) => (
            <FoodComponent
              categoryName={item.categoryName}
              food={item}
              location={item.locationName}
              selectedMenu={item.menuName}
            />
          )}
          ListEmptyComponent={
            <View className="mt-12 flex items-center justify-center">
              <Text className="text-lg font-bold text-ut-burnt-orange">Empty Meal Plan!</Text>
              <Text className="max-w-64 text-center text-ut-grey">
                Swipe right on a food item to add to your meal plan.
              </Text>
            </View>
          }
          stickyHeaderIndices={[0]} // Makes the header sticky
        />
      </Container>
    </>
  );
};

export default MealPlan;
