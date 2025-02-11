import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryData } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '~/utils/supabase';
import { shouldRequery } from '~/utils/time';

const STORAGE_KEY_DATA = 'localData';
const STORAGE_KEY_TIMESTAMP = 'lastQueryTime';

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

interface DataStore {
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
}
// Zustand Store
export const useDataStore = create<DataStore>((set, get) => ({
  data: null,

  fetchData: async () => {
    try {
      // Get stored data & timestamp
      const storedData = await AsyncStorage.getItem(STORAGE_KEY_DATA);
      const lastQueryTime = await AsyncStorage.getItem(STORAGE_KEY_TIMESTAMP);

      // Check if we need to fetch fresh data
      if (storedData && lastQueryTime && !shouldRequery(lastQueryTime)) {
        console.log('using stored data');
        set({ data: JSON.parse(storedData) });
        return;
      }

      // Fetch new data from Supabase
      const { data: fetchedData, error } = await dataQuery;

      if (error) throw error;

      // Store new data & timestamp
      await AsyncStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(fetchedData));
      await AsyncStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());

      set({ data: fetchedData, lastUpdated: new Date() });

      console.log('fetching new data');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  forceFetchData: async () => {
    try {
      // Fetch new data from Supabase
      const { data: fetchedData, error } = await dataQuery;

      if (error) throw error;

      // Store new data & timestamp
      await AsyncStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(fetchedData));
      await AsyncStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());

      set({ data: fetchedData });

      console.log('fetching new data');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  getLocationData: (name: string) => {
    const data = get().data;
    if (!data) return null;

    return data.find((location) => location.name === name) || null;
  },

  getFoodItem: (locationName: string, menuName: string, categoryName: string, itemName: string) => {
    const location = get().getLocationData(locationName);
    if (!location) return null;

    const menu = location.menu.find((menu) => {
      return menu.name === menuName;
    });

    if (!menu) return null;

    const category = menu.menu_category.find((category) => {
      return category.title === categoryName;
    });

    if (!category) return null;

    const foodItem = category.food_item.find((item) => {
      return item.name === itemName;
    });

    return foodItem || null;
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
}));
