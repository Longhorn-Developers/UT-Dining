import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryData } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '~/utils/supabase';
import { shouldRequery } from '~/utils/time';

const STORAGE_KEY_DATA = 'localData';
const STORAGE_KEY_TIMESTAMP = 'lastQueryTime';
const STORAGE_KEY_FAVORITES = 'favoriteFoodItems';
const STORAGE_KEY_MEALPLAN = 'mealPlanItems';

// Supabase query
const dataQuery = supabase.from('location').select(`
    id,
    name,
    menu (
        name,
        menu_category (
        title,
        food_item (
            name,
            link,
            allergens: allergens!food_item_allergens_id_fkey (
              beef,
              egg,
              fish,
              peanuts,
              pork,
              shellfish,
              soy,
              tree_nuts,
              wheat,
              sesame_seeds,
              vegan,
              vegetarian,
              halal
            ),
            nutrition: nutrition_id (
              calories,
              total_fat,
              saturated_fat,
              trans_fat,
              cholesterol,
              sodium,
              total_carbohydrates,
              dietary_fiber,
              total_sugars,
              protein,
              vitamin_d,
              calcium,
              iron,
              potassium,
              ingredients
            )
          )
        )
    )
`);

export type DataQuery = QueryData<typeof dataQuery>;

export type Location = DataQuery[number];
export type Menu = Location['menu'][number];
export type MenuCategory = Menu['menu_category'][number];
export type FoodItem = MenuCategory['food_item'][number];

// Renamed FavoriteFoodItem to StoredFoodItem
export type StoredFoodItem = FoodItem & {
  categoryName: string;
  locationName: string;
  menuName: string;
};

type DataLookup = {
  locations: Map<string, Location>;
  foodItems: Map<string, FoodItem>;
};

const createLookupMaps = (data: DataQuery): DataLookup => {
  const locations = new Map<string, Location>();
  const foodItems = new Map<string, FoodItem>();

  data.forEach((location) => {
    locations.set(location.name as string, location);

    location.menu.forEach((menu) => {
      menu.menu_category.forEach((category) => {
        category.food_item.forEach((item) => {
          foodItems.set(`${location.name}-${menu.name}-${category.title}-${item.name}`, item);
        });
      });
    });
  });

  return { locations, foodItems };
};

interface DataStore extends DataLookup {
  data: DataQuery | null;
  fetchData: () => Promise<void>;
  forceFetchData: () => Promise<void>;
  getLocationData: (name: string) => Location | null;
  getFoodItem: (
    locationName: string,
    menuName: string,
    categoryName: string,
    itemName: string
  ) => FoodItem | null;
  lastUpdated: Date | null;
  getLastUpdated: () => Promise<string | null>;
  setLastUpdated: () => void;
  favoriteFoodItems: StoredFoodItem[];
  addFavoriteFoodItem: (item: StoredFoodItem) => void;
  toggleFavoriteFoodItem: (item: StoredFoodItem) => boolean;
  isFavoriteFoodItem: (item: string) => boolean;
  mealPlanItems: StoredFoodItem[];
  addMealPlanItem: (item: StoredFoodItem) => void;
  toggleMealPlanItem: (item: StoredFoodItem) => boolean;
  isMealPlanItem: (item: string) => boolean;
}

export const useDataStore = create<DataStore>((set, get) => ({
  data: null,
  locations: new Map(),
  foodItems: new Map(),

  fetchData: async () => {
    try {
      // Batch storage reads
      const [storedData, lastQueryTime] = await AsyncStorage.multiGet([
        STORAGE_KEY_DATA,
        STORAGE_KEY_TIMESTAMP,
      ]);

      if (storedData[1] && lastQueryTime[1] && !shouldRequery(lastQueryTime[1])) {
        const parsedData = JSON.parse(storedData[1]);
        set({
          data: parsedData,
          ...createLookupMaps(parsedData),
        });
        return;
      }

      const { data: fetchedData, error } = await dataQuery;
      if (error) throw error;

      // Clear the meal plan AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEY_MEALPLAN);

      // Batch storage writes
      await AsyncStorage.multiSet([
        [STORAGE_KEY_DATA, JSON.stringify(fetchedData)],
        [STORAGE_KEY_TIMESTAMP, new Date().toISOString()],
      ]);

      set({
        data: fetchedData,
        ...createLookupMaps(fetchedData),
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  forceFetchData: async () => {
    try {
      const { data: fetchedData, error } = await dataQuery;

      if (error) throw error;

      await AsyncStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(fetchedData));
      await AsyncStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());

      set({ data: fetchedData });
      console.log('fetching new data');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  getLocationData: (name) => {
    return get().locations.get(name) || null;
  },

  getFoodItem: (locationName, menuName, categoryName, itemName) => {
    return get().foodItems.get(`${locationName}-${menuName}-${categoryName}-${itemName}`) || null;
  },

  getLastUpdated: async () => {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY_DATA);
    set({ data: storedData ? JSON.parse(storedData) : null });
    return AsyncStorage.getItem(STORAGE_KEY_TIMESTAMP);
  },

  setLastUpdated: () => {
    AsyncStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
    set({ lastUpdated: new Date() });
  },

  lastUpdated: null,

  favoriteFoodItems: [],

  addFavoriteFoodItem: (item) => {
    set((state) => {
      const alreadyExists = state.favoriteFoodItems.some(
        (favItem) => favItem.name === item.name && favItem.categoryName === item.categoryName
      );
      if (alreadyExists) return state;
      const newFavorites = [...state.favoriteFoodItems, item];
      AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
      return { favoriteFoodItems: newFavorites };
    });
  },

  toggleFavoriteFoodItem: (item) => {
    set((state) => {
      const alreadyExists = state.favoriteFoodItems.some(
        (favItem) => favItem.name === item.name && favItem.categoryName === item.categoryName
      );
      let newFavorites;
      if (alreadyExists) {
        newFavorites = state.favoriteFoodItems.filter(
          (i) => !(i.name === item.name && i.categoryName === item.categoryName)
        );
      } else {
        newFavorites = [...state.favoriteFoodItems, item];
      }
      AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
      return { favoriteFoodItems: newFavorites };
    });
    // Since set() runs synchronously in Zustand, we can now check the updated state.
    return get().favoriteFoodItems.some(
      (i) => i.name === item.name && i.categoryName === item.categoryName
    );
  },

  isFavoriteFoodItem: (item) => {
    return get().favoriteFoodItems.some((i) => i.name === item);
  },

  mealPlanItems: [],

  addMealPlanItem: (item) => {
    set((state) => {
      const newMealPlanItems = [...state.mealPlanItems, item];
      AsyncStorage.setItem(STORAGE_KEY_MEALPLAN, JSON.stringify(newMealPlanItems));
      return { mealPlanItems: newMealPlanItems };
    });
  },

  toggleMealPlanItem: (item) => {
    set((state) => {
      const alreadyExists = state.mealPlanItems.some(
        (mealItem) => mealItem.name === item.name && mealItem.categoryName === item.categoryName
      );
      let newMealPlanItems;
      if (alreadyExists) {
        newMealPlanItems = state.mealPlanItems.filter(
          (i) => !(i.name === item.name && i.categoryName === item.categoryName)
        );
      } else {
        newMealPlanItems = [...state.mealPlanItems, item];
      }
      AsyncStorage.setItem(STORAGE_KEY_MEALPLAN, JSON.stringify(newMealPlanItems));
      return { mealPlanItems: newMealPlanItems };
    });
    return get().mealPlanItems.some(
      (i) => i.name === item.name && i.categoryName === item.categoryName
    );
  },

  isMealPlanItem: (item) => {
    return get().mealPlanItems.some((i) => i.name === item);
  },
}));
