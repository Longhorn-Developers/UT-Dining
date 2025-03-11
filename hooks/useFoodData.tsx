import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState, useMemo, useRef } from 'react';

import * as schema from '../db/schema';

import { ALLERGEN_EXCEPTIONS, NUTRITION_ORDER } from '~/data/AllergenInfo';
import { getFoodItem, FoodItem } from '~/db/database';

// Helper function to format nutrition keys
const formatNutritionKey = (key: string) =>
  key
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

export function useFoodData(
  location: string | string[],
  menu: string | string[],
  category: string | string[],
  food: string | string[]
) {
  const db = useSQLiteContext();
  // Use useMemo to prevent recreating drizzleDb on each render
  const drizzleDb = useMemo(() => drizzle(db, { schema }), [db]);

  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);

  // Use refs to track if this is the first render
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchFoodItem = async () => {
      if (!location || !menu || !category || !food) {
        router.back();
        return;
      }

      const locString = Array.isArray(location) ? location[0] : location;
      const menuString = Array.isArray(menu) ? menu[0] : menu;
      const categoryString = Array.isArray(category) ? category[0] : category;
      const foodString = Array.isArray(food) ? food[0] : food;

      try {
        const item = await getFoodItem(
          drizzleDb,
          locString,
          menuString,
          categoryString,
          foodString
        );
        if (!item) {
          router.back();
          return;
        }

        setFoodItem(item);
      } catch (error) {
        console.error('Error fetching food item:', error);
      }
    };

    // Only fetch on first render or when parameters change
    if (
      isFirstRender.current ||
      (Array.isArray(food) ? food[0] : food) !== prevFood.current ||
      (Array.isArray(location) ? location[0] : location) !== prevLocation.current
    ) {
      fetchFoodItem();
      isFirstRender.current = false;
    }

    // Store current values for comparison
    prevFood.current = Array.isArray(food) ? food[0] : food;
    prevLocation.current = Array.isArray(location) ? location[0] : location;
  }, [location, menu, category, food, drizzleDb]);

  // Add refs to track previous values
  const prevFood = useRef<string>('');
  const prevLocation = useRef<string>('');

  // Process nutrition data
  const nutritionData = useMemo(() => {
    if (!foodItem?.nutrition) return [];

    return Object.entries(foodItem.nutrition)
      .map(([key, value]) => ({
        key: formatNutritionKey(key),
        value,
      }))
      .filter(({ key }) => key !== 'Ingredients')
      .sort((a, b) => NUTRITION_ORDER.indexOf(a.key) - NUTRITION_ORDER.indexOf(b.key));
  }, [foodItem]);

  // Process allergen data
  const allergenData = useMemo(() => {
    const allergenEntries = foodItem?.allergens ? Object.entries(foodItem.allergens) : [];
    const hasAllergens = allergenEntries.some(([, value]) => value);

    const allergenList = allergenEntries
      .filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key))
      .filter(([, value]) => value)
      .map(([key]) => {
        return key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      });

    const dietaryList = allergenEntries
      .filter(([key]) => ALLERGEN_EXCEPTIONS.has(key))
      .filter(([, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase());

    return { hasAllergens, allergenList, dietaryList };
  }, [foodItem]);

  return {
    foodItem,
    nutritionData,
    ...allergenData,
  };
}
