import { Stack } from 'expo-router';
import { BicepsFlexed, Flame, Wheat } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, FlatList, Image, TextInput } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Notifier } from 'react-native-notifier';

import Alert from '~/components/Alert';
import { RemoveAction } from '~/components/AnimatedActions';
import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import { ALLERGEN_ICONS } from '~/data/AllergenInfo';
import { useMealPlanStore, MealPlanItem } from '~/store/useMealPlanStore';
import { COLORS } from '~/utils/colors';

const MealPlanComponent = ({
  food,
  selectedMenu,
  categoryName,
  location,
  quantity,
}: {
  food: MealPlanItem;
  selectedMenu: string;
  categoryName: string;
  location: string;
  quantity: number;
}) => {
  const updateMealPlanItemQuantity = useMealPlanStore((state) => state.updateMealPlanItemQuantity);
  const removeMealPlanItem = useMealPlanStore((state) => state.removeMealPlanItem);

  // Local state to hold TextInput value.
  const [quantityInput, setQuantityInput] = useState(`${quantity}` || '1');

  const description = `${categoryName} - ${location} (${selectedMenu})`;
  const allergenData = Object.entries(food.allergens || {});

  return (
    <ReanimatedSwipeable
      containerStyle={{
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: COLORS['ut-burnt-orange'],
      }}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={50}
      rightThreshold={0}
      renderRightActions={() => null}
      renderLeftActions={(progress) => <RemoveAction progress={progress} />}
      onSwipeableOpen={(direction, swipeable) => {
        swipeable.close();

        removeMealPlanItem(food.name || '');

        Notifier.showNotification({
          title: `${food.name} removed from today's meal plan!`,
          description: 'You removed this item from your meal plan.',
          swipeEnabled: true,
          Component: Alert,
        });
      }}>
      <View className="flex-row items-center justify-between rounded border border-ut-grey/15 bg-white px-3 py-2 pb-2">
        <View className="max-w-[16rem] gap-1">
          <Text className="line-clamp-2 text-lg font-medium leading-6">{food.name}</Text>
          <Text className="text-sm font-medium text-ut-grey">{description}</Text>
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

        <View className="relative items-center gap-1">
          <TextInput
            className="h-8 w-12 rounded-lg border border-ut-burnt-orange text-center font-bold text-ut-burnt-orange"
            keyboardType="numeric"
            value={quantityInput}
            onChangeText={setQuantityInput}
            onEndEditing={() => {
              let quantity = parseInt(quantityInput, 10);
              if (isNaN(quantity)) {
                quantity = 1;
              }
              if (quantity < 1) {
                removeMealPlanItem(food.name || '');

                Notifier.showNotification({
                  title: `${food.name} removed from today's meal plan!`,
                  description: 'You removed this item from your meal plan.',
                  swipeEnabled: true,
                  Component: Alert,
                });
              } else if (quantity > 99) {
                quantity = 99;
              }
              setQuantityInput(quantity.toString());
              updateMealPlanItemQuantity(food.name || '', quantity);
            }}
          />
          <Text className="text-xs font-medium text-ut-grey">Quantity</Text>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
};

const MealPlan = () => {
  const mealPlanItems = useMealPlanStore((state) => state.mealPlanItems);

  const totalCalories = mealPlanItems.reduce(
    (sum, item) => sum + parseFloat(String(item.nutrition?.calories || 0)) * (item?.quantity || 1),
    0
  );
  const totalProtein = mealPlanItems.reduce(
    (sum, item) => sum + parseFloat(String(item.nutrition?.protein || 0)) * (item?.quantity || 1),
    0
  );
  const totalCarbs = mealPlanItems.reduce(
    (sum, item) =>
      sum + parseFloat(String(item.nutrition?.total_carbohydrates || 0)) * (item?.quantity || 1),
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
          keyExtractor={(item) => `${item.name}-${item.categoryName}-${item.menuName}`}
          ListHeaderComponent={
            <View className="flex gap-y-5 bg-white py-6">
              <TopBar variant="back" />
              <View>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-3xl font-extrabold">Your Meal Plan</Text>
                </View>
                <Text className="font-medium text-ut-grey">
                  Swipe right on a food item to add it to your meal plan. To remove it, swipe right
                  again on the item in your meal plan.
                </Text>
                <Text className="mt-2 text-sm text-ut-grey">
                  <Text className="font-bold text-ut-burnt-orange">Note: </Text>
                  Your meal plan will reset at the end of the day.
                </Text>
              </View>

              <View className="flex-row justify-around rounded-lg border border-ut-grey/15 bg-white p-4">
                <View className="flex-1 items-center">
                  <Text className="text-center text-lg font-bold text-ut-burnt-orange">
                    {totalCalories} kcal
                  </Text>
                  <Text className="text-xs font-medium text-ut-grey">Calories</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-center text-lg font-bold text-ut-burnt-orange">
                    {totalProtein.toFixed(1)}g
                  </Text>
                  <Text className="text-xs font-medium text-ut-grey">Protein</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-center text-lg font-bold text-ut-burnt-orange">
                    {totalCarbs.toFixed(1)}g
                  </Text>
                  <Text className="text-xs font-medium text-ut-grey">Carbs</Text>
                </View>
              </View>

              <View className="my-1 w-full border-b border-b-ut-grey/15" />
            </View>
          }
          data={mealPlanItems}
          contentContainerClassName="px-6"
          renderItem={({ item }) => (
            <MealPlanComponent
              categoryName={item.categoryName}
              food={item}
              location={item.locationName}
              selectedMenu={item.menuName}
              quantity={item.quantity || 1}
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
