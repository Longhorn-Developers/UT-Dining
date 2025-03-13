import { router } from 'expo-router';
import { useEffect, useState, useMemo, useRef } from 'react';

import { useDatabase } from './useDatabase';

import { ALLERGEN_EXCEPTIONS, NUTRITION_ORDER } from '~/data/AllergenInfo';
import { getFoodItem, FoodItem, getFavoriteItem } from '~/db/database';
import { Favorite } from '~/db/schema';

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
  food: string | string[],
  isFavorite?: boolean
) {
  const db = useDatabase();

  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);

  // Use refs to track if this is the first render
  const isFirstRender = useRef(true);

  // Add refs to track previous values
  const prevFood = useRef<string>('');
  const prevLocation = useRef<string>('');
  const prevIsFavorite = useRef<boolean | undefined>(undefined);

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
        let item;

        if (isFavorite) {
          // Fetch from favorites table if isFavorite is true
          item = getFavoriteItem(db, foodString);
          item = convertFavoriteItemToFoodItem(item as Favorite);
        } else {
          // Fetch from regular food items table
          item = await getFoodItem(db, locString, menuString, categoryString, foodString);
        }

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
      (Array.isArray(location) ? location[0] : location) !== prevLocation.current ||
      isFavorite !== prevIsFavorite.current
    ) {
      fetchFoodItem();
      isFirstRender.current = false;
    }

    // Store current values for comparison
    prevFood.current = Array.isArray(food) ? food[0] : food;
    prevLocation.current = Array.isArray(location) ? location[0] : location;
    prevIsFavorite.current = isFavorite;
  }, [location, menu, category, food, isFavorite, db]);

  // Process nutrition data
  const nutritionData = useMemo(() => {
    if (!foodItem?.nutrition) return [];

    return Object.entries(foodItem.nutrition)
      .map(([key, value]) => ({
        key: formatNutritionKey(key),
        value,
      }))
      .filter(({ key }) => key !== 'Ingredients' && key !== 'Id')
      .sort((a, b) => NUTRITION_ORDER.indexOf(a.key) - NUTRITION_ORDER.indexOf(b.key));
  }, [foodItem]);

  // Process allergen data
  const allergenData = useMemo(() => {
    const allergenEntries = foodItem?.allergens ? Object.entries(foodItem.allergens) : [];
    const hasAllergens = allergenEntries.some(([, value]) => value);

    const allergenList = allergenEntries
      .filter(([key]) => !ALLERGEN_EXCEPTIONS.has(key) && key !== 'id')
      .filter(([, value]) => value)
      .map(([key]) => {
        return key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      });

    const dietaryList = allergenEntries
      .filter(([key]) => ALLERGEN_EXCEPTIONS.has(key) && key !== 'id')
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

const convertFavoriteItemToFoodItem = (favoriteItem: Favorite): FoodItem => {
  return {
    name: favoriteItem.name,
    link: favoriteItem.link,
    allergens: {
      id: 0,
      beef: favoriteItem.beef,
      egg: favoriteItem.egg,
      fish: favoriteItem.fish,
      peanuts: favoriteItem.peanuts,
      pork: favoriteItem.pork,
      shellfish: favoriteItem.shellfish,
      soy: favoriteItem.soy,
      tree_nuts: favoriteItem.tree_nuts,
      wheat: favoriteItem.wheat,
      sesame_seeds: favoriteItem.sesame_seeds,
      halal: favoriteItem.halal,
      vegan: favoriteItem.vegan,
      vegetarian: favoriteItem.vegetarian,
      milk: favoriteItem.milk,
    },
    nutrition: {
      id: 0,
      calories: favoriteItem.calories,
      protein: favoriteItem.protein,
      total_fat: favoriteItem.total_fat,
      total_carbohydrates: favoriteItem.total_carbohydrates,
      dietary_fiber: favoriteItem.dietary_fiber,
      total_sugars: favoriteItem.total_sugars,
      saturated_fat: favoriteItem.saturated_fat,
      calcium: favoriteItem.calcium,
      iron: favoriteItem.iron,
      potassium: favoriteItem.potassium,
      sodium: favoriteItem.sodium,
      cholesterol: favoriteItem.cholesterol,
      vitamin_d: favoriteItem.vitamin_d,
      ingredients: favoriteItem.ingredients,
      trans_fat: favoriteItem.trans_fat,
    },
  } as FoodItem;
};
