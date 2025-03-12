import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

import { shouldRequery } from '~/utils/time';

const STORAGE_KEY_MEALPLAN = 'mealPlanItems';

export interface MealPlanItem {
  name: string;
  locationName: string;
  menuName: string;
  categoryName: string;
  quantity: number;
  nutrition: {
    calories: string;
    protein: string;
    total_carbohydrates: string;
  } | null;
  allergens: Record<string, boolean>;
}

interface MealPlanState {
  mealPlanItems: MealPlanItem[];
  initialized: boolean;

  // Actions
  addMealPlanItem: (item: MealPlanItem) => void;
  removeMealPlanItem: (name: string) => void;
  toggleMealPlanItem: (item: Omit<MealPlanItem, 'quantity'>) => void;
  updateMealPlanItemQuantity: (name: string, quantity: number) => void;
  clearMealPlan: () => void;
  isMealPlanItem: (name: string) => boolean;
  getMealPlanItem: (name: string) => MealPlanItem | null;
  checkAndClearIfStale: () => Promise<void>;
}

/**
 * Zustand store for managing meal plan items.
 * Persists meal plan in RNMMKV storage.
 */
export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      mealPlanItems: [],
      initialized: false,

      // Add a food item to meal plan
      addMealPlanItem: (item) => {
        set((state) => {
          const existingItemIndex = state.mealPlanItems.findIndex(
            (mealItem) => mealItem.name === item.name
          );

          if (existingItemIndex >= 0) {
            // Item already exists, update it
            const newItems = [...state.mealPlanItems];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: (newItems[existingItemIndex].quantity || 1) + (item.quantity || 1),
            };
            return { mealPlanItems: newItems };
          }

          // Add new item
          return {
            mealPlanItems: [...state.mealPlanItems, { ...item, quantity: item.quantity || 1 }],
          };
        });
      },

      // Remove a food item from meal plan
      removeMealPlanItem: (name) => {
        set((state) => ({
          mealPlanItems: state.mealPlanItems.filter((item) => item.name !== name),
        }));
      },

      toggleMealPlanItem: (item) => {
        const isMealPlanItem = get().mealPlanItems.some((mealItem) => mealItem.name === item.name);

        if (isMealPlanItem) {
          set((state) => ({
            mealPlanItems: state.mealPlanItems.filter((mealItem) => mealItem.name !== item.name),
          }));
        } else {
          set((state) => ({
            mealPlanItems: [...state.mealPlanItems, { ...item, quantity: 1 }],
          }));
        }
      },

      // Update quantity of an item in meal plan
      updateMealPlanItemQuantity: (name, quantity) => {
        set((state) => ({
          mealPlanItems: state.mealPlanItems.map((item) =>
            item.name === name ? { ...item, quantity } : item
          ),
        }));
      },

      // Clear entire meal plan
      clearMealPlan: () => {
        set({ mealPlanItems: [] });
      },

      // Check if item is in meal plan
      isMealPlanItem: (name) => {
        return get().mealPlanItems.some((item) => item.name === name);
      },

      // Get meal plan item by name
      getMealPlanItem: (name) => {
        return get().mealPlanItems.find((item) => item.name === name) || null;
      },

      // Check if data is stale and clear meal plan if needed
      checkAndClearIfStale: async () => {
        try {
          // If data should be requeried (e.g., it's a new day), clear the meal plan
          if (await shouldRequery()) {
            console.log('Menu data is stale, clearing meal plan');
            get().clearMealPlan();
          }
        } catch (error) {
          console.error('Error checking meal plan staleness:', error);
        }
      },
    }),
    {
      name: STORAGE_KEY_MEALPLAN,
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = true;

          // Check if we need to clear the meal plan on rehydration
          setTimeout(() => {
            useMealPlanStore.getState().checkAndClearIfStale();
          }, 100);
        }
      },
    }
  )
);
