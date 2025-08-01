import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BicepsFlexed, Flame, Wheat } from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import { useFoodData } from '~/hooks/useFoodData';
import { getSafePostHog } from '~/services/analytics/posthog';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';
import AllergenSection from './components/AllergenSection';
import NutritionFooter from './components/NutritionFooter';
import NutritionInfo from './components/NutritionInfo';
import NutritionRow from './components/NutritionRow';

const FoodScreen = () => {
  const params = useLocalSearchParams<{
    food: string;
    menu: string;
    category: string;
    location: string;
    favorite: string;
  }>();
  const { food, menu, category, location, favorite } = params;
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const { foodItem, nutritionData, hasAllergens, allergenList, dietaryList } = useFoodData(
    location,
    menu,
    category,
    food,
    favorite === 'true',
  );

  const analytics = getSafePostHog(usePostHog());

  // Filter out serving size from nutrition data
  const nutritionDataFiltered = nutritionData.filter((item) => item.key !== 'Serving Size');

  // biome-ignorelint/correctness/useExhaustiveDependencies: analytics only
  useEffect(() => {
    analytics.screen(`${food}`, {
      location,
      menu,
      category,
    });
  }, []);
  return (
    <SheetProvider context="food">
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
        <Stack.Screen options={{ title: 'Food' }} />
        {/* Pull Down Indicator (outside FlashList) */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: isDarkMode ? '#111827' : '#fff',
          }}
        >
          <View
            style={{
              width: 40,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: isDarkMode ? '#fff' : '#F0F0F0',
            }}
          />
        </View>
        <Container disableInsets className="mx-0 mt-2">
          <FlashList
            estimatedItemSize={32}
            data={nutritionDataFiltered}
            renderItem={({ item }) => <NutritionRow item={item} isDarkMode={isDarkMode} />}
            ListHeaderComponent={
              <View className="mx-6 mt-6 flex gap-y-5">
                <TopBar variant="food" />

                {foodItem && (
                  <View>
                    <Text
                      className={cn(
                        'font-extrabold font-sans text-3xl',
                        isDarkMode ? 'text-white' : 'text-black',
                      )}
                    >
                      {foodItem.name}
                    </Text>

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
                        isDarkMode={isDarkMode}
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
                        isDarkMode={isDarkMode}
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
                        isDarkMode={isDarkMode}
                      />
                    </View>

                    {hasAllergens && (
                      <View className="mt-3 flex-col justify-center gap-1">
                        <AllergenSection
                          title="Allergens:"
                          items={allergenList}
                          showTitle={allergenList.length > 0}
                          isDarkMode={isDarkMode}
                        />
                        <AllergenSection
                          title="Dietary:"
                          items={dietaryList}
                          showTitle={dietaryList.length > 0}
                          isDarkMode={isDarkMode}
                        />
                      </View>
                    )}

                    <View
                      className={cn(
                        'my-4 w-full border-b',
                        isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15',
                      )}
                    />

                    <Text
                      className={cn(
                        'mb-2 font-bold text-2xl',
                        isDarkMode ? 'text-white' : 'text-black',
                      )}
                    >
                      Nutrition Facts
                    </Text>

                    <View className="mb-2">
                      <View className="mb-2 flex-row justify-between">
                        <Text className={cn('font-bold', isDarkMode ? 'text-white' : 'text-black')}>
                          Serving Size
                        </Text>
                        <Text className={cn('font-bold', isDarkMode ? 'text-white' : 'text-black')}>
                          {foodItem.nutrition?.serving_size}
                        </Text>
                      </View>
                      <View
                        className={cn(
                          'w-full border-b',
                          isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15',
                        )}
                      />
                    </View>
                  </View>
                )}
              </View>
            }
            ListFooterComponent={
              foodItem && (
                <View className="px-6 pb-28">
                  <NutritionFooter
                    ingredients={foodItem.nutrition?.ingredients as string}
                    allergens={allergenList}
                    dietary={dietaryList}
                    isDarkMode={isDarkMode}
                  />
                </View>
              )
            }
          />
        </Container>
      </View>
    </SheetProvider>
  );
};

export default FoodScreen;
