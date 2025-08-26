import { eq, sql } from 'drizzle-orm';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type { Database } from '~/types/database.types';
import { getTodayInCentralTime } from '~/utils/date';
import * as schema from './schema';
import { allergens, food_item, location, menu, menu_category, nutrition } from './schema';

type LocationDB = Database['public']['Tables']['location']['Row'];
type LocationTypeDB = Database['public']['Tables']['location_type']['Row'];
type MenuDB = Database['public']['Tables']['menu']['Row'];
type MenuCategoryDB = Database['public']['Tables']['menu_category']['Row'];
type FoodItemDB = Database['public']['Tables']['food_item']['Row'];
type NutritionDB = Database['public']['Tables']['nutrition']['Row'];
type AllergensDB = Database['public']['Tables']['allergens']['Row'];
type AppInformationDB = Database['public']['Tables']['app_information']['Row'];
type NotificationDB = Database['public']['Tables']['notifications']['Row'];
type NotificationTypeDB = Database['public']['Tables']['notification_types']['Row'];

// Type for the complete Supabase response data
export interface SupabaseResponse {
  location: LocationDB[];
  location_type: LocationTypeDB[];
  menu: MenuDB[];
  menu_category: MenuCategoryDB[];
  food_item: FoodItemDB[];
  nutrition: NutritionDB[];
  allergens: AllergensDB[];
  app_information: AppInformationDB[];
  notifications: NotificationDB[];
  notification_types: NotificationTypeDB[];
}

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
  allergens?: schema.Allergens;
  nutrition?: schema.Nutrition;
}

/**
 * Splits an array into chunks of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number = 1000): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Inserts data into a SQLite table in chunks to avoid "too many SQL variables" error
 * SQLite has a limit of 999 variables per SQL statement
 */
async function insertInChunks<T>(
  db: ExpoSQLiteDatabase<typeof schema>,
  // biome-ignore lint/suspicious/noExplicitAny: Drizzle table types are complex
  table: any,
  data: T[],
  chunkSize: number = 100,
) {
  if (data.length === 0) return;

  const chunks = chunkArray(data, chunkSize);
  const insertPromises = chunks.map((chunk) => db.insert(table).values(chunk));

  await Promise.all(insertPromises);
}

/**
 * Fetches all relevant data from Supabase tables including locations, menus, notifications, and nutrition/allergens.
 *
 * - Uses provided date or defaults to today's date in Central Time.
 * - Fetches base data in parallel.
 * - Fetches related menu categories, food items, nutrition, and allergens if menus exist.
 *
 * @param date - Optional date string in YYYY-MM-DD format. Defaults to today in Central Time.
 * @returns A Promise resolving to an object containing all fetched data, or null if an error occurs.
 */
const querySupabase = async (): Promise<SupabaseResponse | null> => {
  console.log('🔍 Querying Supabase...');
  const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_PROXY_URL as string);
  const data = (await res.json()) as SupabaseResponse;

  console.log('✅ Supabase data fetched');
  return data;
};

/**
 * Inserts Supabase data into local SQLite database
 *
 * @param db - The Expo SQLite database instance.
 * @param data - Optional data object to insert. If not provided, will fetch from Supabase.
 * @param date - Optional date string in YYYY-MM-DD format. Defaults to today in Central Time.
 */
export const insertDataIntoSQLiteDB = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  data?: SupabaseResponse,
) => {
  // If data is provided, use it directly; otherwise fetch from Supabase
  const supabaseData =
    data ||
    (async () => {
      console.log('📡 Fetching fresh data from Supabase...');
      return await querySupabase();
    })();

  // Resolve the data if it's a promise
  const resolvedData = await Promise.resolve(supabaseData);

  if (resolvedData) {
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
        db.delete(schema.app_information).execute(),
        db.delete(schema.notifications).execute(),
        db.delete(schema.notification_types).execute(),
      ]);

      // Insert data from Supabase using chunked insertions to avoid SQLite variable limits
      const insertPromises = [];

      if (resolvedData.location?.length > 0) {
        insertPromises.push(
          insertInChunks(db, location, resolvedData.location as schema.Location[], 45),
        );
      }
      if (resolvedData.location_type?.length > 0) {
        insertPromises.push(
          insertInChunks(
            db,
            schema.location_type,
            resolvedData.location_type as schema.LocationType[],
            150,
          ),
        );
      }
      if (resolvedData.menu?.length > 0) {
        insertPromises.push(insertInChunks(db, menu, resolvedData.menu as schema.Menu[], 150));
      }
      if (resolvedData.menu_category?.length > 0) {
        insertPromises.push(
          insertInChunks(
            db,
            menu_category,
            resolvedData.menu_category as schema.MenuCategory[],
            200,
          ),
        );
      }
      if (resolvedData.food_item?.length > 0) {
        insertPromises.push(
          insertInChunks(db, food_item, resolvedData.food_item as schema.FoodItem[], 150),
        );
      }
      if (resolvedData.nutrition?.length > 0) {
        insertPromises.push(
          insertInChunks(db, nutrition, resolvedData.nutrition as schema.Nutrition[], 60),
        );
      }
      if (resolvedData.allergens?.length > 0) {
        insertPromises.push(
          insertInChunks(db, allergens, resolvedData.allergens as schema.Allergens[], 60),
        );
      }
      if (resolvedData.app_information?.length > 0) {
        insertPromises.push(
          insertInChunks(
            db,
            schema.app_information,
            resolvedData.app_information as (typeof schema.app_information.$inferInsert)[],
            150,
          ),
        );
      }
      if (resolvedData.notifications && resolvedData.notifications.length > 0) {
        // For each notification, determine what sent_at value to use. If the notification is scheduled, sent_at will each scheduled_at value. If the notification is not scheduled, sent_at will be created_at value.
        const notificationsWithSentAt = resolvedData.notifications.map((notification) => {
          if (notification.scheduled_at) {
            return { ...notification, sent_at: notification.scheduled_at };
          }
          return { ...notification, sent_at: notification.created_at };
        });
        insertPromises.push(
          insertInChunks(
            db,
            schema.notifications,
            notificationsWithSentAt as schema.Notification[],
            150,
          ),
        );
      }
      if (resolvedData.notification_types && resolvedData.notification_types.length > 0) {
        insertPromises.push(
          insertInChunks(
            db,
            schema.notification_types,
            resolvedData.notification_types as unknown[],
            200,
          ),
        );
      }

      if (insertPromises.length > 0) {
        await Promise.all(insertPromises);
      }

      console.log('✅ Data added to database');
    } catch (error) {
      console.error('❌ Error inserting data into SQLite:', error);
    }
  } else {
    console.error('❌ Error fetching data from Supabase');
  }
};

/**
 * Retrieves a list of menu names for a given location.
 *
 * @param db - The Expo SQLite database instance.
 * @param locationName - The name of the location to query.
 * @param date - Optional date string in YYYY-MM-DD format. Defaults to today in Central Time.
 * @returns A Promise resolving to an array of menu names.
 */
export const getLocationMenuNames = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
  date?: string,
) => {
  const targetDate = date || getTodayInCentralTime();

  const data = await db
    .select({ menu: schema.menu })
    .from(schema.location)
    .leftJoin(schema.menu, eq(schema.menu.location_id, schema.location.id))
    .where(sql`${schema.location.name} = ${locationName} AND ${schema.menu.date} = ${targetDate}`)
    .execute();

  return data.map((row) => row.menu?.name).filter((name) => name !== undefined);
};

/**
 * Retrieves structured menu and food data for a specific location and menu name.
 *
 * If an error occurs during fetching, attempts to return only basic location info.
 *
 * @param db - The Expo SQLite database instance.
 * @param locationName - The name of the location to query.
 * @param menuName - The name of the menu to query.
 * @param date - Optional date string in YYYY-MM-DD format. Defaults to today in Central Time.
 * @returns A Promise resolving to a `Location` object or null if not found.
 */
export const getLocationMenuData = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
  menuName: string,
  date?: string,
) => {
  try {
    const targetDate = date || getTodayInCentralTime();

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
        location_display_order: schema.location.display_order,
        location_latitude: schema.location.latitude,
        location_longitude: schema.location.longitude,
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
        // Filter by location name, menu name, and date
        sql`${schema.location.name} = ${locationName} AND ${schema.menu.name} = ${menuName} AND ${schema.menu.date} = ${targetDate}`,
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
      display_order: data[0]?.location_display_order || 1000,
      latitude: data[0]?.location_latitude || null,
      longitude: data[0]?.location_longitude || null,
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
        const foodItems = categoryMap.get(row.category_title);

        if (!foodItems) {
          throw new Error(`Food items array not found for category: ${row.category_title}`);
        }

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
  } catch (e) {
    console.warn('⚠️ Error fetching location menu data:', e);
    // Try to fetch just the location info as a fallback
    try {
      const locationOnly = await db
        .select({
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
          location_display_order: schema.location.display_order,
          location_type: schema.location_type.name,
        })
        .from(schema.location)
        .leftJoin(schema.location_type, eq(schema.location.type_id, schema.location_type.id))
        .where(eq(schema.location.name, locationName))
        .execute();

      if (!locationOnly || locationOnly.length === 0) {
        return null;
      }

      // Return basic location info with empty menus array
      return {
        location_name: locationName,
        menus: [],
        type: locationOnly[0].location_type || '',
        id: locationOnly[0]?.location_id || '',
        name: locationOnly[0]?.location_name || null,
        colloquial_name: locationOnly[0]?.location_colloquial_name || null,
        description: locationOnly[0]?.location_description || '',
        address: locationOnly[0]?.location_address || '',
        type_id: locationOnly[0]?.location_type_id || '',
        created_at: locationOnly[0]?.location_created_at || null,
        updated_at: locationOnly[0]?.location_updated_at || null,
        regular_service_hours: locationOnly[0]?.location_regular_service_hours || undefined,
        methods_of_payment: locationOnly[0]?.location_methods_of_payment || undefined,
        meal_times: locationOnly[0]?.location_meal_times || undefined,
        google_maps_link: locationOnly[0]?.location_google_maps_link || '',
        apple_maps_link: locationOnly[0]?.location_apple_maps_link || '',
        image: locationOnly[0]?.location_image || null,
        force_close: locationOnly[0]?.location_force_close || false,
        has_menus: locationOnly[0]?.location_has_menus || false,
        display_order: locationOnly[0]?.location_display_order || 1000,
      };
    } catch (fallbackError) {
      console.warn('⚠️ Error fetching fallback location info:', fallbackError);
      return null;
    }
  }
};

/**
 * Retrieves a single food item by its location, menu, category, and item name.
 *
 * @param db - The Expo SQLite database instance.
 * @param locationName - The location containing the item.
 * @param menuName - The menu containing the item.
 * @param categoryName - The category containing the item.
 * @param itemName - The name of the food item.
 * @returns A Promise resolving to a `FoodItem` or null if not found.
 */
export const getFoodItem = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
  menuName: string,
  categoryName: string,
  itemName: string,
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
          AND ${schema.food_item.name} = ${itemName}`,
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

/**
 * Retrieves all favorite food items stored in the local database.
 *
 * @param db - The Expo SQLite database instance.
 * @returns A Promise resolving to an array of favorite items.
 */
export const getFavorites = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  const data = await db.select().from(schema.favorites).execute();

  return data;
};

/**
 * Checks whether a food item is marked as a favorite.
 *
 * @param db - The Expo SQLite database instance.
 * @param foodName - The name of the food item.
 * @returns A boolean indicating if the item is a favorite.
 */
export const isFavoriteItem = (db: ExpoSQLiteDatabase<typeof schema>, foodName: string) => {
  const favorite = db
    .select()
    .from(schema.favorites)
    .where(eq(schema.favorites.name, foodName))
    .get();

  return favorite !== null && favorite !== undefined;
};

/**
 * Retrieves a single favorite food item by its name.
 *
 * @param db - The Expo SQLite database instance.
 * @param foodName - The name of the food item.
 * @returns A Promise resolving to the favorite item or null.
 */
export const getFavoriteItem = (db: ExpoSQLiteDatabase<typeof schema>, foodName: string) => {
  return db.select().from(schema.favorites).where(eq(schema.favorites.name, foodName)).get();
};

/**
 * Toggles a food item's favorite status:
 * - Adds it to favorites if not present.
 * - Removes it if already marked as favorite.
 *
 * Also copies nutrition and allergens data into the favorites table.
 *
 * @param db - The Expo SQLite database instance.
 * @param foodItem - The food item to toggle.
 * @param locationName - The location name associated with the item.
 * @param menuName - The menu name associated with the item.
 * @param categoryName - The category name associated with the item.
 * @returns A Promise resolving to true if added, or false if removed.
 */
export const toggleFavorites = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  foodItem: FoodItem,
  locationName: string,
  menuName: string,
  categoryName: string,
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
  const nutrition =
    foodItem.nutrition?.id !== undefined
      ? db
          .select()
          .from(schema.nutrition)
          .where(eq(schema.nutrition.id, foodItem.nutrition.id))
          .get()
      : undefined;

  const allergens =
    foodItem.allergens?.id !== undefined
      ? db
          .select()
          .from(schema.allergens)
          .where(eq(schema.allergens.id, foodItem.allergens.id))
          .get()
      : undefined;

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

/**
 * Retrieves detailed information about a specific location.
 *
 * @param db - The Expo SQLite database instance.
 * @param locationName - The name of the location to query.
 * @returns A Promise resolving to a `LocationWithType` object or null if not found.
 */
export const getLocationDetails = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
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
        display_order: schema.location.display_order,
        latitude: schema.location.latitude,
        longitude: schema.location.longitude,
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
      display_order: locationData[0].display_order || 1000,
    };
  } catch (error) {
    console.error('❌ Error fetching location details:', error);
    return null;
  }
};

/**
 * Retrieves complete location data including menus, categories, and food items.
 *
 * @param db - The Expo SQLite database instance.
 * @param locationName - The name of the location.
 * @returns A Promise resolving to a structured `Location` object or null.
 */
export const getCompleteLocationData = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
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
        location_display_order: schema.location.display_order,
        location_latitude: schema.location.latitude,
        location_longitude: schema.location.longitude,
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
      display_order: data[0]?.location_display_order || 1000,
      latitude: data[0]?.location_latitude || null,
      longitude: data[0]?.location_longitude || null,
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

      const menu = menuMap.get(row.menu_name);

      if (!menu) continue;

      // Group food items by category within this menu
      if (row.category_title) {
        let category = menu.menu_categories.find(
          (cat) => cat.category_title === row.category_title,
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

/**
 * Retrieves app-wide information (e.g., configuration or metadata).
 *
 * @param db - The Expo SQLite database instance.
 * @returns A Promise resolving to the `AppInformation` object or null.
 */
export const getAppInformation = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<schema.AppInformation | null> => {
  try {
    const data = await db.select().from(schema.app_information).execute();

    if (data.length === 0) {
      return null;
    }

    return data[0] as schema.AppInformation;
  } catch (error) {
    console.error('❌ Error fetching app information:', error);
    return null;
  }
};

/**
 * Retrieves all locations that have geographic coordinates.
 *
 * @param db - The Expo SQLite database instance.
 * @returns A Promise resolving to an array of locations with latitude and longitude.
 */
export const getAllLocationsWithCoordinates = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<
  (Pick<
    schema.Location,
    'id' | 'name' | 'description' | 'latitude' | 'longitude' | 'address' | 'has_menus'
  > & {
    type: string;
  })[]
> => {
  const data = await db
    .select({
      id: schema.location.id,
      name: schema.location.name,
      description: schema.location.description,
      latitude: schema.location.latitude,
      longitude: schema.location.longitude,
      address: schema.location.address,
      type: schema.location_type.name,
      has_menus: schema.location.has_menus,
    })
    .from(schema.location)
    .where(
      sql`${schema.location.latitude} IS NOT NULL AND ${schema.location.longitude} IS NOT NULL`,
    )
    .leftJoin(schema.location_type, eq(schema.location.type_id, schema.location_type.id))
    .execute();

  return data.map((item) => ({
    ...item,
    type: item.type || 'Unknown',
  }));
};

/**
 * Retrieves all available notification types.
 *
 * @param db - The Expo SQLite database instance.
 * @returns A Promise resolving to an array of notification types.
 */
export const getNotificationTypes = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<schema.NotificationType[]> => {
  const data = await db.select().from(schema.notification_types).execute();
  return data;
};

/**
 * Retrieves all notifications, ordered by the most recent.
 *
 * @param db - The Expo SQLite database instance.
 * @returns A Promise resolving to an array of notifications with their type names.
 */
export const getNotifications = async (
  db: ExpoSQLiteDatabase<typeof schema>,
): Promise<(schema.Notification & { type_name: string })[]> => {
  const data = await db
    .select({
      id: schema.notifications.id,
      title: schema.notifications.title,
      body: schema.notifications.body,
      redirect_url: schema.notifications.redirect_url,
      type: schema.notifications.type,
      sent_at: schema.notifications.sent_at,
      type_name: schema.notification_types.name,
    })
    .from(schema.notifications)
    .leftJoin(
      schema.notification_types,
      eq(schema.notifications.type, schema.notification_types.id),
    )
    .orderBy(sql`datetime(${schema.notifications.sent_at}) DESC`)
    .execute();

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    redirect_url: row.redirect_url,
    type: row.type,
    sent_at: row.sent_at,
    type_name: row.type_name || 'system_announcement',
  }));
};

/**
 * Inserts a notification into the local SQLite database if it doesn't already exist.
 *
 * @param db - The Expo SQLite database instance.
 * @param notificationData - The notification data to insert.
 * @returns A Promise resolving when the insert is complete.
 */
export const insertNotification = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  notificationData: {
    id?: string;
    title: string;
    body: string;
    sent_at: string;
    redirect_url?: string;
    type?: string;
  },
): Promise<void> => {
  try {
    const notificationId =
      notificationData.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Check if notification with this ID already exists
    const existingNotification = await db
      .select({ id: schema.notifications.id })
      .from(schema.notifications)
      .where(eq(schema.notifications.id, notificationId))
      .get();

    if (existingNotification) {
      console.log('ℹ️  Notification already exists, skipping insert.');
      return;
    }

    await db
      .insert(schema.notifications)
      .values({
        id: notificationId,
        title: notificationData.title,
        body: notificationData.body,
        redirect_url: notificationData.redirect_url || null,
        type: notificationData.type || null,
        sent_at: notificationData.sent_at,
      })
      .execute();

    console.log('✅ Notification inserted into SQLite database:', notificationId);
  } catch (error) {
    console.error('❌ Error inserting notification into SQLite:', error);
    throw error;
  }
};
