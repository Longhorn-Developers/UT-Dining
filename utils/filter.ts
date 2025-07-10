import { FoodItem } from '~/services/database/database';
import { useMealPlanStore } from '~/store/useMealPlanStore';

export const filterFoodItems = (foodItems: FoodItem[], filters: any, favorites: any[]) => {
  return foodItems.filter((item) => {
    // Check favorites filter
    if (filters.favorites && !favorites?.some((fav) => fav.name === item.name)) {
      return false;
    }

    // Check meal plan filter
    if (filters.mealPlan && !useMealPlanStore.getState().isMealPlanItem(item.name as string)) {
      return false;
    }

    // Check allergens filter
    const allergenFilters = Object.entries(filters.allergens).filter(([_, value]) => value);
    if (allergenFilters.length > 0) {
      for (const [allergen] of allergenFilters) {
        if (
          item.allergens &&
          allergen in item.allergens &&
          item.allergens[allergen as keyof typeof item.allergens]
        ) {
          return false; // Filter out if it contains this allergen
        }
      }
    }

    // Check dietary filter
    const dietaryFilters = Object.entries(filters.dietary).filter(([_, value]) => value);
    if (dietaryFilters.length > 0) {
      // Item must match ALL selected dietary preferences
      for (const [diet] of dietaryFilters) {
        if (
          !item.allergens ||
          !(diet in item.allergens) ||
          !item.allergens[diet as keyof typeof item.allergens]
        ) {
          return false; // Filter out if it doesn't match this dietary preference
        }
      }
    }

    return true;
  });
};
