import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BicepsFlexed, Flame, Wheat } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';

import AllergenSection from './components/AllergenSection';
import NutritionFooter from './components/NutritionFooter';
import NutritionInfo from './components/NutritionInfo';
import NutritionRow from './components/NutritionRow';
import { useFoodData } from '../../../hooks/useFoodData';

import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import { COLORS } from '~/utils/colors';

const FoodScreen = () => {
  const params = useLocalSearchParams<{
    food: string;
    menu: string;
    category: string;
    location: string;
    favorite: string;
  }>();
  const { food, menu, category, location, favorite } = params;

  const { foodItem, nutritionData, hasAllergens, allergenList, dietaryList } = useFoodData(
    location,
    menu,
    category,
    food,
    favorite === 'true'
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Food' }} />
      <Container className="mx-0">
        <FlashList
          estimatedItemSize={14}
          data={nutritionData}
          renderItem={({ item }) => <NutritionRow item={item} />}
          ListHeaderComponent={
            <View className="mx-6 mt-6 flex gap-y-5">
              <TopBar variant="food" />

              {foodItem && (
                <View>
                  <Text className="font-sans text-3xl font-extrabold">{foodItem.name}</Text>

                  <View className="flex-row gap-x-2">
                    <NutritionInfo
                      icon={
                        <Flame
                          fill={COLORS['ut-burnt-orange']}
                          color={COLORS['ut-burnt-orange']}
                          size={16}
                        />
                      }
                      value={`${foodItem.nutrition?.calories} kcal`}
                    />
                    <NutritionInfo
                      icon={
                        <BicepsFlexed
                          fill={COLORS['ut-burnt-orange']}
                          color={COLORS['ut-burnt-orange']}
                          size={16}
                        />
                      }
                      value={`${foodItem.nutrition?.protein} Protein`}
                    />
                    <NutritionInfo
                      icon={
                        <Wheat
                          fill={COLORS['ut-burnt-orange']}
                          color={COLORS['ut-burnt-orange']}
                          size={16}
                        />
                      }
                      value={`${foodItem.nutrition?.total_carbohydrates} Carbs`}
                    />
                  </View>

                  {hasAllergens && (
                    <View className="mt-3 flex-col justify-center gap-1">
                      <AllergenSection
                        title="Allergens:"
                        items={allergenList}
                        showTitle={allergenList.length > 0}
                      />
                      <AllergenSection
                        title="Dietary:"
                        items={dietaryList}
                        showTitle={dietaryList.length > 0}
                      />
                    </View>
                  )}

                  <View className="my-4 w-full border-b border-b-ut-grey/15" />

                  <Text className="mb-2 text-2xl font-bold">Nutrition Facts</Text>

                  <View className="mb-2">
                    <View className="mb-2 flex-row justify-between">
                      <Text className="font-bold">Serving Size</Text>
                      <Text className="font-bold">1 each</Text>
                    </View>
                    <View className="w-full border-b border-b-ut-grey/15" />
                  </View>
                </View>
              )}
            </View>
          }
          ListFooterComponent={
            foodItem && (
              <View className="px-6">
                <NutritionFooter
                  ingredients={foodItem.nutrition?.ingredients as string}
                  allergens={allergenList}
                  dietary={dietaryList}
                />
              </View>
            )
          }
        />
      </Container>
    </>
  );
};

export default FoodScreen;
