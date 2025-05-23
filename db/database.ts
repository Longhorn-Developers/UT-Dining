import { eq, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { addCoffeeShopLocations } from './coffee-shops';
import { allergens, food_item, location, menu, menu_category, nutrition } from './schema';
import * as schema from '../db/schema';

import { miscStorage } from '~/store/misc-storage';
import { supabase } from '~/utils/supabase';
import { shouldRequery } from '~/utils/time';

export interface Location {
  location_name: schema.Location['name'];
  menus: Menu[];
}

export interface Menu {
  menu_name: schema.Menu['name'];
  menu_categories: MenuCategory[];
}

export interface MenuCategory {
  category_title: schema.MenuCategory['title'];
  food_items: FoodItem[];
}

export interface FoodItem {
  name: schema.FoodItem['name'];
  link: schema.FoodItem['link'];
  allergens: schema.Allergens;
  nutrition: schema.Nutrition;
}

const querySupabase = async () => {
  try {
    const [
      locationResult,
      menuResult,
      menuCategoryResult,
      foodItemResult,
      nutritionResult,
      allergensResult,
    ] = await Promise.all([
      supabase.from('location').select('*'),
      supabase.from('menu').select('*'),
      supabase.from('menu_category').select('*'),
      supabase.from('food_item').select('*'),
      supabase.from('nutrition').select('*'),
      supabase.from('allergens').select('*'),
    ]);

    const errors = [];
    if (locationResult.error) {
      errors.push(`location: ${locationResult.error.message}`);
      console.error('Error fetching location:', locationResult.error);
    }
    if (menuResult.error) {
      errors.push(`menu: ${menuResult.error.message}`);
      console.error('Error fetching menu:', menuResult.error);
    }
    if (menuCategoryResult.error) {
      errors.push(`menu_category: ${menuCategoryResult.error.message}`);
      console.error('Error fetching menu_category:', menuCategoryResult.error);
    }
    if (foodItemResult.error) {
      errors.push(`food_item: ${foodItemResult.error.message}`);
      console.error('Error fetching food_item:', foodItemResult.error);
    }
    if (nutritionResult.error) {
      errors.push(`nutrition: ${nutritionResult.error.message}`);
      console.error('Error fetching nutrition:', nutritionResult.error);
    }
    if (allergensResult.error) {
      errors.push(`allergens: ${allergensResult.error.message}`);
      console.error('Error fetching allergens:', allergensResult.error);
    }

    if (errors.length > 0) {
      throw new Error('Error(s) fetching Supabase data: ' + errors.join(', '));
    }

    return {
      location: locationResult.data ?? [],
      menu: menuResult.data ?? [],
      menu_category: menuCategoryResult.data ?? [],
      food_item: foodItemResult.data ?? [],
      nutrition: nutritionResult.data ?? [],
      allergens: allergensResult.data ?? [],
    };
  } catch (error) {
    console.error('Unexpected error fetching Supabase data:', error);
    return null;
  }
};

/**
 * Inserts Supabase data into local SQLite database
 *
 * @param db - The Expo SQLite database instance.
 * @param force - A flag indicating whether to force the operation
 */
export const insertDataIntoSQLiteDB = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  force = false
) => {
  if (!force) {
    const shouldRefresh = await shouldRequery();
    console.log('Should refresh data:', shouldRefresh);

    if (!shouldRefresh) {
      console.log('Data already added to database');
      await addCoffeeShopLocations(db);
      return;
    }
  }

  console.log('Fetching fresh data from Supabase...');
  const data = await querySupabase();

  if (data) {
    try {
      // Delete everything to start fresh
      await Promise.all([
        db.delete(location).execute(),
        db.delete(menu).execute(),
        db.delete(menu_category).execute(),
        db.delete(food_item).execute(),
        db.delete(nutrition).execute(),
        db.delete(allergens).execute(),
      ]);

      // Insert data from Supabase
      await Promise.all([
        data.location.length > 0
          ? db.insert(location).values(
              data.location.map((loc) => ({
                name: loc.name ?? '',
                updated_at: loc.updated_at,
              }))
            )
          : Promise.resolve(),
        data.menu.length > 0 ? db.insert(menu).values(data.menu) : Promise.resolve(),
        data.menu_category.length > 0
          ? db.insert(menu_category).values(data.menu_category)
          : Promise.resolve(),
        data.food_item.length > 0 ? db.insert(food_item).values(data.food_item) : Promise.resolve(),
        data.nutrition.length > 0 ? db.insert(nutrition).values(data.nutrition) : Promise.resolve(),
        data.allergens.length > 0 ? db.insert(allergens).values(data.allergens) : Promise.resolve(),
      ]);

      console.log('Data added to database');

      // Always add coffee shop locations
      await addCoffeeShopLocations(db);
    } catch (error) {
      console.error('Error inserting data into SQLite:', error);
      return;
    }

    miscStorage.set('lastQueryTime', new Date().toISOString());
  } else {
    console.error('Error fetching data from Supabase');
  }
};

export const getLocationMenuNames = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string
) => {
  const data = await db
    .select({ menu: schema.menu })
    .from(schema.location)
    .leftJoin(schema.menu, eq(schema.menu.location_id, schema.location.id))
    .where(eq(schema.location.name, locationName))
    .execute();

  return data.map((row) => row.menu?.name);
};

export const getLocationMenuData = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
  menuName: string
) => {
  try {
    const data = await db
      .select({
        location_id: schema.location.id,
        location_name: schema.location.name,
        menu_id: schema.menu.id,
        menu_name: schema.menu.name,
        category_id: schema.menu_category.id,
        category_title: schema.menu_category.title,
        food_id: schema.food_item.id,
        food_name: schema.food_item.name,
        food_link: schema.food_item.link,
        allergens: {
          id: schema.allergens.id,
          beef: schema.allergens.beef,
          egg: schema.allergens.egg,
          fish: schema.allergens.fish,
          peanuts: schema.allergens.peanuts,
          pork: schema.allergens.pork,
          shellfish: schema.allergens.shellfish,
          soy: schema.allergens.soy,
          tree_nuts: schema.allergens.tree_nuts,
          wheat: schema.allergens.wheat,
          sesame_seeds: schema.allergens.sesame_seeds,
          vegan: schema.allergens.vegan,
          vegetarian: schema.allergens.vegetarian,
          halal: schema.allergens.halal,
          milk: schema.allergens.milk,
        },
        nutrition: {
          id: schema.nutrition.id,
          calories: schema.nutrition.calories,
          total_fat: schema.nutrition.total_fat,
          total_carbohydrates: schema.nutrition.total_carbohydrates,
          protein: schema.nutrition.protein,
        },
      })
      .from(schema.location)
      .leftJoin(schema.menu, eq(schema.menu.location_id, schema.location.id))
      .leftJoin(schema.menu_category, eq(schema.menu_category.menu_id, schema.menu.id))
      .leftJoin(schema.food_item, eq(schema.food_item.menu_category_id, schema.menu_category.id))
      .leftJoin(schema.allergens, eq(schema.allergens.id, schema.food_item.allergens_id))
      .leftJoin(schema.nutrition, eq(schema.nutrition.id, schema.food_item.nutrition_id))
      .where(
        // Filter by both location name and menu name
        sql`${schema.location.name} = ${locationName} AND ${schema.menu.name} = ${menuName}`
      )
      .execute();

    // Create structured data from query result
    const structuredData: Location = {
      location_name: locationName,
      menus: [],
    };

    // Create a menu entry for the selected menu
    const menuEntry: Menu = {
      menu_name: menuName,
      menu_categories: [],
    };
    structuredData.menus.push(menuEntry);

    // Group food items by category
    const categoryMap = new Map<string, FoodItem[]>();

    for (const row of data) {
      if (!row.category_title) continue;

      // Get or create array for this category
      if (!categoryMap.has(row.category_title)) {
        categoryMap.set(row.category_title, []);
      }

      // Add food item to the category if it exists
      if (row.food_name) {
        const foodItems = categoryMap.get(row.category_title)!;

        // Check if food item already exists to avoid duplicates
        const existingItem = foodItems.find((item) => item.name === row.food_name);
        if (!existingItem) {
          foodItems.push({
            name: row.food_name,
            link: row.food_link,
            allergens: row.allergens as unknown as schema.Allergens,
            nutrition: row.nutrition as unknown as schema.Nutrition,
          });
        }
      }
    }

    // Convert the map to array of categories
    for (const [categoryTitle, foodItems] of categoryMap.entries()) {
      menuEntry.menu_categories.push({
        category_title: categoryTitle,
        food_items: foodItems,
      });
    }

    return structuredData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

export const getFoodItem = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
  menuName: string,
  categoryName: string,
  itemName: string
): Promise<FoodItem | null> => {
  const data = await db
    .select({
      food_name: schema.food_item.name,
      food_link: schema.food_item.link,
      allergens: {
        id: schema.allergens.id,
        beef: schema.allergens.beef,
        egg: schema.allergens.egg,
        fish: schema.allergens.fish,
        peanuts: schema.allergens.peanuts,
        pork: schema.allergens.pork,
        shellfish: schema.allergens.shellfish,
        soy: schema.allergens.soy,
        tree_nuts: schema.allergens.tree_nuts,
        wheat: schema.allergens.wheat,
        sesame_seeds: schema.allergens.sesame_seeds,
        vegan: schema.allergens.vegan,
        vegetarian: schema.allergens.vegetarian,
        halal: schema.allergens.halal,
        milk: schema.allergens.milk,
      },
      nutrition: {
        id: schema.nutrition.id,
        serving_size: schema.nutrition.serving_size,
        calories: schema.nutrition.calories,
        total_fat: schema.nutrition.total_fat,
        saturated_fat: schema.nutrition.saturated_fat,
        trans_fat: schema.nutrition.trans_fat,
        cholesterol: schema.nutrition.cholesterol,
        sodium: schema.nutrition.sodium,
        total_carbohydrates: schema.nutrition.total_carbohydrates,
        dietary_fiber: schema.nutrition.dietary_fiber,
        total_sugars: schema.nutrition.total_sugars,
        protein: schema.nutrition.protein,
        vitamin_d: schema.nutrition.vitamin_d,
        calcium: schema.nutrition.calcium,
        iron: schema.nutrition.iron,
        potassium: schema.nutrition.potassium,
        ingredients: schema.nutrition.ingredients,
      },
    })
    .from(schema.location)
    .leftJoin(schema.menu, eq(schema.menu.location_id, schema.location.id))
    .leftJoin(schema.menu_category, eq(schema.menu_category.menu_id, schema.menu.id))
    .leftJoin(schema.food_item, eq(schema.food_item.menu_category_id, schema.menu_category.id))
    .leftJoin(schema.allergens, eq(schema.allergens.id, schema.food_item.allergens_id))
    .leftJoin(schema.nutrition, eq(schema.nutrition.id, schema.food_item.nutrition_id))
    .where(
      sql`${schema.location.name} = ${locationName} 
          AND ${schema.menu.name} = ${menuName}
          AND ${schema.menu_category.title} = ${categoryName}
          AND ${schema.food_item.name} = ${itemName}`
    )
    .execute();

  // Return null if no results found
  if (data.length === 0 || !data[0].food_name) {
    return null;
  }

  // Convert the result to a StructuredFoodItem
  const foodItem: FoodItem = {
    name: data[0].food_name,
    link: data[0].food_link,
    allergens: data[0].allergens as unknown as schema.Allergens,
    nutrition: data[0].nutrition as unknown as schema.Nutrition,
  };

  return foodItem;
};

export const getFavorites = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  const data = await db.select().from(schema.favorites).execute();

  return data;
};

export const isFavoriteItem = (db: ExpoSQLiteDatabase<typeof schema>, foodName: string) => {
  const favorite = db
    .select()
    .from(schema.favorites)
    .where(eq(schema.favorites.name, foodName))
    .get();

  return favorite !== null && favorite !== undefined;
};

export const getFavoriteItem = (db: ExpoSQLiteDatabase<typeof schema>, foodName: string) => {
  return db.select().from(schema.favorites).where(eq(schema.favorites.name, foodName)).get();
};

// Function to add a food item to favorites
export const toggleFavorites = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  foodItem: FoodItem,
  locationName: string,
  menuName: string,
  categoryName: string
) => {
  if (isFavoriteItem(db, foodItem.name as string)) {
    // Remove the item from favorites
    await db
      .delete(schema.favorites)
      .where(eq(schema.favorites.name, foodItem.name as string))
      .execute();

    return false;
  }

  // Get nutrition and allergens data
  const nutrition = db
    .select()
    .from(schema.nutrition)
    .where(eq(schema.nutrition.id, foodItem.nutrition.id))
    .get();

  const allergens = db
    .select()
    .from(schema.allergens)
    .where(eq(schema.allergens.id, foodItem.allergens.id))
    .get();

  // Insert into favorites table
  await db
    .insert(schema.favorites)
    .values({
      name: foodItem.name as string,
      location_name: locationName,
      menu_name: menuName,
      category_name: categoryName,
      date_added: new Date().toISOString(),
      link: foodItem.link,

      // Copy nutrition data
      serving_size: nutrition?.serving_size,
      calories: nutrition?.calories,
      total_fat: nutrition?.total_fat,
      saturated_fat: nutrition?.saturated_fat,
      trans_fat: nutrition?.trans_fat,
      cholesterol: nutrition?.cholesterol,
      sodium: nutrition?.sodium,
      total_carbohydrates: nutrition?.total_carbohydrates,
      dietary_fiber: nutrition?.dietary_fiber,
      total_sugars: nutrition?.total_sugars,
      protein: nutrition?.protein,
      vitamin_d: nutrition?.vitamin_d,
      calcium: nutrition?.calcium,
      iron: nutrition?.iron,
      potassium: nutrition?.potassium,
      ingredients: nutrition?.ingredients,

      // Copy allergens data
      beef: allergens?.beef,
      egg: allergens?.egg,
      fish: allergens?.fish,
      peanuts: allergens?.peanuts,
      pork: allergens?.pork,
      shellfish: allergens?.shellfish,
      soy: allergens?.soy,
      tree_nuts: allergens?.tree_nuts,
      wheat: allergens?.wheat,
      sesame_seeds: allergens?.sesame_seeds,
      vegan: allergens?.vegan,
      vegetarian: allergens?.vegetarian,
      halal: allergens?.halal,
      milk: allergens?.milk,
    })
    .execute();

  return true;
};
