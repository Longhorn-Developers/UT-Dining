import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AllergenFilters {
  [key: string]: boolean;
}

interface DietaryFilters {
  [key: string]: boolean;
}

interface FiltersState {
  filters: {
    favorites: boolean;
    mealPlan: boolean;
    allergens: AllergenFilters;
    dietary: DietaryFilters;
  };
  toggleFavoriteFilter: () => void;
  toggleMealPlanFilter: () => void;
  toggleAllergenFilter: (allergen: string) => void;
  toggleDietaryFilter: (diet: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      filters: {
        favorites: false,
        mealPlan: false,
        allergens: {},
        dietary: {},
      },

      toggleFavoriteFilter: () => {
        set((state) => ({
          filters: {
            ...state.filters,
            favorites: !state.filters.favorites,
          },
        }));
      },

      toggleMealPlanFilter: () => {
        set((state) => ({
          filters: {
            ...state.filters,
            mealPlan: !state.filters.mealPlan,
          },
        }));
      },

      toggleAllergenFilter: (allergen: string) => {
        set((state) => ({
          filters: {
            ...state.filters,
            allergens: {
              ...state.filters.allergens,
              [allergen]: !state.filters.allergens[allergen],
            },
          },
        }));
      },

      toggleDietaryFilter: (diet: string) => {
        set((state) => ({
          filters: {
            ...state.filters,
            dietary: {
              ...state.filters.dietary,
              [diet]: !state.filters.dietary[diet],
            },
          },
        }));
      },

      resetFilters: () => {
        set({
          filters: {
            favorites: false,
            mealPlan: false,
            allergens: {},
            dietary: {},
          },
        });
      },
    }),
    {
      name: 'filters-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
