import { AppState, type AppStateStatus } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

const STORAGE_KEY_MEALPLAN = 'mealPlanItems';
const MEAL_PLAN_RESET_HOUR = 0; // Hour when meal plan resets (24-hour format, 0-23) - 0 = midnight

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
  lastResetDate: string | null;
  initialized: boolean;

  // Actions
  addMealPlanItem: (item: MealPlanItem) => void;
  removeMealPlanItem: (name: string) => void;
  toggleMealPlanItem: (item: Omit<MealPlanItem, 'quantity'>) => void;
  updateMealPlanItemQuantity: (name: string, quantity: number) => void;
  clearMealPlan: () => void;
  isMealPlanItem: (name: string) => boolean;
  getMealPlanItem: (name: string) => MealPlanItem | null;
  checkAndResetIfNeeded: () => void;
}

/**
 * Get today's reset timestamp in local timezone
 */
function getTodayResetTime(): Date {
  const now = new Date();
  const todayReset = new Date(now);
  todayReset.setHours(MEAL_PLAN_RESET_HOUR, 0, 0, 0);

  // If it's before reset hour, use yesterday's reset time as the reset point
  if (now.getHours() < MEAL_PLAN_RESET_HOUR) {
    todayReset.setDate(todayReset.getDate() - 1);
  }

  return todayReset;
}

/**
 * Check if a reset is needed based on the last reset date
 */
function shouldReset(lastResetDate: string | null): boolean {
  if (!lastResetDate) return true;

  const lastReset = new Date(lastResetDate);
  const currentReset = getTodayResetTime();

  return currentReset > lastReset;
}

/**
 * Zustand store for managing meal plan items.
 * Persists meal plan in RNMMKV storage.
 * Automatically resets daily at the configured hour.
 */
export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      mealPlanItems: [],
      lastResetDate: null,
      initialized: false,

      // Check and reset meal plan if needed
      checkAndResetIfNeeded: () => {
        const state = get();
        if (shouldReset(state.lastResetDate)) {
          set({
            mealPlanItems: [],
            lastResetDate: getTodayResetTime().toISOString(),
          });
        }
      },

      // Add a food item to meal plan
      addMealPlanItem: (item) => {
        set((state) => {
          const existingItemIndex = state.mealPlanItems.findIndex(
            (mealItem) => mealItem.name === item.name,
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
            item.name === name ? { ...item, quantity } : item,
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
    }),
    {
      name: STORAGE_KEY_MEALPLAN,
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = true;
          // Check for reset when store is rehydrated
          state.checkAndResetIfNeeded();

          // Set up AppState listener for checking reset when app comes to foreground
          const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
              state.checkAndResetIfNeeded();
            }
          };

          AppState.addEventListener('change', handleAppStateChange);

          // Note: We can't clean up the subscription from here, but it's okay
          // as we want it to persist for the app's lifetime
        }
      },
    },
  ),
);
