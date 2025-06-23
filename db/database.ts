import { eq, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { allergens, food_item, location, menu, menu_category, nutrition } from './schema';
import * as schema from '../db/schema';

import { miscStorage } from '~/store/misc-storage';
import { supabase } from '~/utils/supabase';
import { shouldRequery } from '~/utils/time';

export interface Location extends schema.Location {
  location_name: schema.Location['name'];
  type: schema.LocationType['name'];
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
    // Calculate today's date in Central Time Zone
    const today = new Date();
    const centralTimeOffset = -6; // Central Time Zone offset
    const centralTime = new Date(today.getTime() + centralTimeOffset * 60 * 60 * 1000);
    const formattedDate = centralTime.toISOString().split('T')[0];

    // Fetch base data in parallel (independent queries)
    const [locationResult, locationTypeResult, menuResult] = await Promise.all([
      supabase.from('location').select('*'),
      supabase.from('location_type').select('*'),
      supabase.from('menu').select('*').eq('date', formattedDate),
    ]);

    // Check for errors in base queries
    if (locationResult.error) {
      console.error('❌ Error fetching location:', locationResult.error);
      throw new Error(`location: ${locationResult.error.message}`);
    }
    if (locationTypeResult.error) {
      console.error('❌ Error fetching location_type:', locationTypeResult.error);
      throw new Error(`location_type: ${locationTypeResult.error.message}`);
    }
    if (menuResult.error) {
      console.error('❌ Error fetching menu:', menuResult.error);
      throw new Error(`menu: ${menuResult.error.message}`);
    }

    const locationData = locationResult.data ?? [];
    const locationTypeData = locationTypeResult.data ?? [];
    const menuData = menuResult.data ?? [];

    // Early return if no menus for today
    if (menuData.length === 0) {
      console.log('ℹ️ No menus found for today:', formattedDate);
      return {
        location: locationData,
        location_type: locationTypeData,
        menu: [],
        menu_category: [],
        food_item: [],
        nutrition: [],
        allergens: [],
      };
    }

    // Extract IDs for subsequent queries
    const menuIds = menuData.map((menu) => menu.id);

    // Fetch menu categories
    const menuCategoryResult = await supabase
      .from('menu_category')
      .select('*')
      .in('menu_id', menuIds);

    if (menuCategoryResult.error) {
      console.error('❌ Error fetching menu_category:', menuCategoryResult.error);
      throw new Error(`menu_category: ${menuCategoryResult.error.message}`);
    }

    const menuCategoryData = menuCategoryResult.data ?? [];

    // Early return if no menu categories
    if (menuCategoryData.length === 0) {
      console.log('ℹ️ No menu categories found for menus:', menuIds);
      return {
        location: locationData,
        location_type: locationTypeData,
        menu: menuData,
        menu_category: [],
        food_item: [],
        nutrition: [],
        allergens: [],
      };
    }

    const menuCategoryIds = menuCategoryData.map((category) => category.id);

    // Fetch food items
    const foodItemResult = await supabase
      .from('food_item')
      .select('*')
      .in('menu_category_id', menuCategoryIds);

    if (foodItemResult.error) {
      console.error('❌ Error fetching food_item:', foodItemResult.error);
      throw new Error(`food_item: ${foodItemResult.error.message}`);
    }

    const foodItemData = foodItemResult.data ?? [];

    // Early return if no food items
    if (foodItemData.length === 0) {
      console.log('ℹ️ No food items found for categories:', menuCategoryIds);
      return {
        location: locationData,
        location_type: locationTypeData,
        menu: menuData,
        menu_category: menuCategoryData,
        food_item: [],
        nutrition: [],
        allergens: [],
      };
    }

    // Extract nutrition and allergen IDs from food items
    const nutritionIds = foodItemData
      .map((item: any) => item.nutrition_id)
      .filter((id) => id !== null);
    const allergenIds = foodItemData
      .map((item: any) => item.allergens_id)
      .filter((id) => id !== null);

    // Fetch nutrition and allergens data in parallel
    const nutritionPromise =
      nutritionIds.length > 0
        ? supabase.from('nutrition').select('*').in('id', nutritionIds)
        : Promise.resolve({ data: [], error: null });

    const allergensPromise =
      allergenIds.length > 0
        ? supabase.from('allergens').select('*').in('id', allergenIds)
        : Promise.resolve({ data: [], error: null });

    const [nutritionResult, allergensResult] = await Promise.all([
      nutritionPromise,
      allergensPromise,
    ]);

    // Check for errors in nutrition and allergens queries
    if (nutritionResult.error) {
      console.error('❌ Error fetching nutrition:', nutritionResult.error);
      throw new Error(`nutrition: ${nutritionResult.error.message}`);
    }
    if (allergensResult.error) {
      console.error('❌ Error fetching allergens:', allergensResult.error);
      throw new Error(`allergens: ${allergensResult.error.message}`);
    }

    console.log('✅ Successfully fetched all Supabase data');
    return {
      location: locationData,
      location_type: locationTypeData,
      menu: menuData,
      menu_category: menuCategoryData,
      food_item: foodItemData,
      nutrition: nutritionResult.data ?? [],
      allergens: allergensResult.data ?? [],
    };
  } catch (error) {
    console.error('❌ Unexpected error fetching Supabase data:', error);
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
    console.log('🔄 Should refresh data:', shouldRefresh);

    if (!shouldRefresh) {
      console.log('✅ Data already added to database');
      return;
    }
  }

  console.log('📡 Fetching fresh data from Supabase...');
  const data = await querySupabase();

  if (data) {
    try {
      // Delete everything to start fresh
      await Promise.all([
        db.delete(location).execute(),
        db.delete(schema.location_type).execute(),
        db.delete(menu).execute(),
        db.delete(menu_category).execute(),
        db.delete(food_item).execute(),
        db.delete(nutrition).execute(),
        db.delete(allergens).execute(),
      ]);

      // Insert data from Supabase (with proper type casting)
      const insertPromises = [];

      if (data.location.length > 0) {
        insertPromises.push(db.insert(location).values(data.location as any));
      }
      if (data.location_type.length > 0) {
        insertPromises.push(db.insert(schema.location_type).values(data.location_type as any));
      }
      if (data.menu.length > 0) {
        insertPromises.push(db.insert(menu).values(data.menu as any));
      }
      if (data.menu_category.length > 0) {
        insertPromises.push(db.insert(menu_category).values(data.menu_category as any));
      }
      if (data.food_item.length > 0) {
        insertPromises.push(db.insert(food_item).values(data.food_item as any));
      }
      if (data.nutrition.length > 0) {
        insertPromises.push(db.insert(nutrition).values(data.nutrition as any));
      }
      if (data.allergens.length > 0) {
        insertPromises.push(db.insert(allergens).values(data.allergens as any));
      }

      if (insertPromises.length > 0) {
        await Promise.all(insertPromises);
      }

      console.log('✅ Data added to database');
    } catch (error) {
      console.error('❌ Error inserting data into SQLite:', error);
      return;
    }

    miscStorage.set('lastQueryTime', new Date().toISOString());
  } else {
    console.error('❌ Error fetching data from Supabase');
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
        // Complete location information
        location_id: schema.location.id,
        location_name: schema.location.name,
        location_colloquial_name: schema.location.colloquial_name,
        location_description: schema.location.description,
        location_address: schema.location.address,
        location_regular_service_hours: schema.location.regular_service_hours,
        location_methods_of_payment: schema.location.methods_of_payment,
        location_meal_times: schema.location.meal_times,
        location_google_maps_link: schema.location.google_maps_link,
        location_apple_maps_link: schema.location.apple_maps_link,
        location_image: schema.location.image,
        location_force_close: schema.location.force_close,
        location_created_at: schema.location.created_at,
        location_updated_at: schema.location.updated_at,
        location_type_id: schema.location.type_id,
        location_has_menus: schema.location.has_menus,

        // Menu and food data
        menu_id: schema.menu.id,
        menu_name: schema.menu.name,
        category_id: schema.menu_category.id,
        category_title: schema.menu_category.title,
        food_id: schema.food_item.id,
        food_name: schema.food_item.name,
        food_link: schema.food_item.link,
        type: schema.location_type.name,
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
      .leftJoin(schema.location_type, eq(schema.location_type.id, schema.location.type_id))
      .where(
        // Filter by both location name and menu name
        sql`${schema.location.name} = ${locationName} AND ${schema.menu.name} = ${menuName}`
      )
      .execute();

    // Create structured data from query result
    const structuredData: Location = {
      location_name: locationName,
      menus: [],
      type: data[0]?.type || '',
      id: data[0]?.location_id || '',
      name: data[0]?.location_name || null,
      colloquial_name: data[0]?.location_colloquial_name || null,
      description: data[0]?.location_description || '',
      address: data[0]?.location_address || '',
      type_id: data[0]?.location_type_id || '',
      created_at: data[0]?.location_created_at || null,
      updated_at: data[0]?.location_updated_at || null,
      regular_service_hours: data[0]?.location_regular_service_hours || undefined,
      methods_of_payment: data[0]?.location_methods_of_payment || undefined,
      meal_times: data[0]?.location_meal_times || undefined,
      google_maps_link: data[0]?.location_google_maps_link || '',
      apple_maps_link: data[0]?.location_apple_maps_link || '',
      image: data[0]?.location_image || null,
      force_close: data[0]?.location_force_close || false,
      has_menus: data[0]?.location_has_menus || false,
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
    console.warn('⚠️ Error fetching location menu data:', e);
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

export const getLocationDetails = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string
): Promise<schema.LocationWithType | null> => {
  try {
    const locationData = await db
      .select({
        id: schema.location.id,
        name: schema.location.name,
        created_at: schema.location.created_at,
        updated_at: schema.location.updated_at,
        colloquial_name: schema.location.colloquial_name,
        description: schema.location.description,
        address: schema.location.address,
        type_id: schema.location.type_id,
        regular_service_hours: schema.location.regular_service_hours,
        methods_of_payment: schema.location.methods_of_payment,
        meal_times: schema.location.meal_times,
        google_maps_link: schema.location.google_maps_link,
        apple_maps_link: schema.location.apple_maps_link,
        image: schema.location.image,
        force_close: schema.location.force_close,
        has_menus: schema.location.has_menus,
        type: schema.location_type.name,
      })
      .from(schema.location)
      .leftJoin(schema.location_type, eq(schema.location.type_id, schema.location_type.id))
      .where(eq(schema.location.name, locationName))
      .execute();

    if (locationData.length === 0) {
      return null;
    }

    return {
      ...locationData[0],
      type: locationData[0].type || '',
    };
  } catch (error) {
    console.error('❌ Error fetching location details:', error);
    return null;
  }
};

export const getCompleteLocationData = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string
): Promise<Location | null> => {
  try {
    const data = await db
      .select({
        // Complete location information
        location_id: schema.location.id,
        location_name: schema.location.name,
        location_colloquial_name: schema.location.colloquial_name,
        location_description: schema.location.description,
        location_address: schema.location.address,
        location_regular_service_hours: schema.location.regular_service_hours,
        location_methods_of_payment: schema.location.methods_of_payment,
        location_meal_times: schema.location.meal_times,
        location_google_maps_link: schema.location.google_maps_link,
        location_apple_maps_link: schema.location.apple_maps_link,
        location_image: schema.location.image,
        location_force_close: schema.location.force_close,
        location_created_at: schema.location.created_at,
        location_updated_at: schema.location.updated_at,
        location_type_id: schema.location.type_id,
        location_has_menus: schema.location.has_menus,

        // Menu and food data (optional)
        menu_id: schema.menu.id,
        menu_name: schema.menu.name,
        category_id: schema.menu_category.id,
        category_title: schema.menu_category.title,
        food_id: schema.food_item.id,
        food_name: schema.food_item.name,
        food_link: schema.food_item.link,
        type: schema.location_type.name,
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
      .leftJoin(schema.location_type, eq(schema.location_type.id, schema.location.type_id))
      .where(eq(schema.location.name, locationName))
      .execute();

    if (data.length === 0) {
      return null;
    }

    // Create structured data from query result
    const structuredData: Location = {
      location_name: locationName,
      menus: [],
      type: data[0]?.type || '',
      id: data[0]?.location_id || '',
      name: data[0]?.location_name || null,
      colloquial_name: data[0]?.location_colloquial_name || null,
      description: data[0]?.location_description || '',
      address: data[0]?.location_address || '',
      type_id: data[0]?.location_type_id || '',
      created_at: data[0]?.location_created_at || null,
      updated_at: data[0]?.location_updated_at || null,
      regular_service_hours: data[0]?.location_regular_service_hours || undefined,
      methods_of_payment: data[0]?.location_methods_of_payment || undefined,
      meal_times: data[0]?.location_meal_times || undefined,
      google_maps_link: data[0]?.location_google_maps_link || '',
      apple_maps_link: data[0]?.location_apple_maps_link || '',
      image: data[0]?.location_image || null,
      force_close: data[0]?.location_force_close || false,
      has_menus: data[0]?.location_has_menus || false,
    };

    // Group menus and their categories
    const menuMap = new Map<string, Menu>();

    for (const row of data) {
      if (!row.menu_name) continue;

      // Get or create menu
      if (!menuMap.has(row.menu_name)) {
        menuMap.set(row.menu_name, {
          menu_name: row.menu_name,
          menu_categories: [],
        });
      }

      const menu = menuMap.get(row.menu_name)!;

      // Group food items by category within this menu
      if (row.category_title) {
        let category = menu.menu_categories.find(
          (cat) => cat.category_title === row.category_title
        );

        if (!category) {
          category = {
            category_title: row.category_title,
            food_items: [],
          };
          menu.menu_categories.push(category);
        }

        // Add food item to the category if it exists and isn't already added
        if (row.food_name) {
          const existingItem = category.food_items.find((item) => item.name === row.food_name);
          if (!existingItem) {
            category.food_items.push({
              name: row.food_name,
              link: row.food_link,
              allergens: row.allergens as unknown as schema.Allergens,
              nutrition: row.nutrition as unknown as schema.Nutrition,
            });
          }
        }
      }
    }

    // Convert the map to array of menus
    structuredData.menus = Array.from(menuMap.values());

    return structuredData;
  } catch (e) {
    console.error('Error fetching complete location data:', e);
    return null;
  }
};
