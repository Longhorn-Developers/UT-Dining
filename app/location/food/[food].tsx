import { FlashList } from '@shopify/flash-list';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { BicepsFlexed, Droplet, Flame } from 'lucide-react-native';
import React from 'react';
import { View, Text, Image } from 'react-native';

import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import {
  ALLERGEN_EXCEPTIONS,
  DAILY_VALUES,
  INDENTED_NUTRITION,
  NUTRITION_ORDER,
  ALLERGEN_ICONS,
} from '~/data/AllergenInfo';
import { useDataStore } from '~/store/useDataStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

type SearchParams = {
  food: string;
  menu: string;
  category: string;
  location: string;
};

const formatNutritionKey = (key: string) =>
  key
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const getPercentage = (value: number, key: string) =>
  Math.round((value / (DAILY_VALUES[key] || 1)) * 100);

const FoodScreen = () => {
  const params = useLocalSearchParams<SearchParams>();
  const { food, menu, category, location } = params;
  const { getFoodItem } = useDataStore();

  // Early exit for missing params
  if (!location || !menu || !category || !food) {
    router.back();
    return null;
  }

  const foodItem = getFoodItem(location, menu, category, food);
  if (!foodItem) {
    router.back();
    return null;
  }

  // Process nutrition data
  const nutritionData = foodItem.nutrition
    ? Object.entries(foodItem.nutrition)
        .map(([key, value]) => ({
          key: formatNutritionKey(key),
          value,
        }))
        .filter(({ key }) => key !== 'Ingredients')
        .sort((a, b) => NUTRITION_ORDER.indexOf(a.key) - NUTRITION_ORDER.indexOf(b.key))
    : [];

  // Process allergen data
  const allergenEntries = foodItem.allergens ? Object.entries(foodItem.allergens) : [];
  const hasAllergens = allergenEntries.some(([, value]) => value);

  const allergenList = allergenEntries
    .filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key))
    .filter(([, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase());

  const dietaryList = allergenEntries
    .filter(([key]) => ALLERGEN_EXCEPTIONS.has(key))
    .filter(([, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase());

  const renderNutritionRow = ({ item }: { item: { key: string; value: unknown } }) => {
    const nutrientValue = parseFloat(String(item.value ?? 0));
    const percentage = getPercentage(nutrientValue, item.key);

    return (
      <View className="mb-2 px-6">
        <View
          className={cn(
            'mb-2 flex-row justify-between',
            INDENTED_NUTRITION.has(item.key) ? 'pl-4' : ''
          )}>
          <View className="flex-row gap-x-0.5">
            {item.key === 'Trans Fat' ? (
              <>
                <Text className={cn('italic', INDENTED_NUTRITION.has(item.key) && 'font-normal')}>
                  Trans
                </Text>
                <Text className={cn(INDENTED_NUTRITION.has(item.key) && 'font-normal')}> Fat</Text>
              </>
            ) : (
              <Text className={cn(INDENTED_NUTRITION.has(item.key) ? 'font-normal' : 'font-bold')}>
                {item.key}
              </Text>
            )}
            <Text>{item.key === 'Calories' ? ` ${item.value} kCal` : ` ${item.value}`}</Text>
          </View>
          <View>{DAILY_VALUES[item.key] && <Text className="font-bold">{percentage}%</Text>}</View>
        </View>
        <View className="w-full border-b border-b-ut-grey/15" />
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Food' }} />
      <Container className="mx-0">
        <FlashList
          estimatedItemSize={14}
          data={nutritionData}
          renderItem={renderNutritionRow}
          ListHeaderComponent={
            <View className="mx-6 mt-6 flex gap-y-5">
              <TopBar variant="location" />

              <View>
                <Text className="font-sans text-3xl font-extrabold">{foodItem.name}</Text>

                <View className="flex-row gap-x-4">
                  <NutritionInfo
                    icon={
                      <Flame
                        fill={COLORS['ut-burnt-orange']}
                        color={COLORS['ut-burnt-orange']}
                        size={16}
                      />
                    }
                    value={`${foodItem.nutrition?.calories} kCal`}
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
                      <Droplet
                        fill={COLORS['ut-burnt-orange']}
                        color={COLORS['ut-burnt-orange']}
                        size={16}
                      />
                    }
                    value={`${foodItem.nutrition?.total_fat} Fat`}
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
            </View>
          }
          ListFooterComponent={
            <View className="px-6">
              <NutritionFooter
                ingredients={foodItem.nutrition?.ingredients ?? undefined}
                allergens={allergenList}
                dietary={dietaryList}
              />
            </View>
          }
        />
      </Container>
    </>
  );
};

// Helper Components
const NutritionInfo = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <View className="flex-row items-center gap-x-1">
    {icon}
    <Text className="text-base font-semibold">{value}</Text>
  </View>
);

const AllergenSection = ({
  title,
  items,
  showTitle,
}: {
  title: string;
  items: string[];
  showTitle: boolean;
}) => (
  <View className="flex-row items-center gap-x-1">
    {showTitle && <Text className="font-medium">{title}</Text>}
    <View className="flex-row gap-x-1">
      {items.map((key) => (
        <View key={key} className="items-center">
          <Image
            source={ALLERGEN_ICONS[key.toLowerCase()]}
            className="size-4 rounded-full"
            resizeMode="contain"
          />
        </View>
      ))}
    </View>
  </View>
);

const NutritionFooter = ({
  ingredients,
  allergens,
  dietary,
}: {
  ingredients?: string;
  allergens: string[];
  dietary: string[];
}) => (
  <>
    <View className="mb-2">
      <Text className="font-bold">
        Allergens: <Text className="text-xs font-normal">{allergens.join(', ') || 'None'}</Text>
      </Text>
    </View>

    <View className="w-full border-b border-b-ut-grey/15" />

    <View className="my-2">
      <Text className="font-bold">
        Dietary: <Text className="text-xs font-normal">{dietary.join(', ') || 'None'}</Text>
      </Text>
    </View>

    <View className="w-full border-b border-b-ut-grey/15" />

    <View className="my-2">
      <Text className="font-bold">
        Ingredients: <Text className="text-xs font-normal">{ingredients || 'N/A'}</Text>
      </Text>
    </View>
  </>
);

export default FoodScreen;
