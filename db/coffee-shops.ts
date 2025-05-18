import { sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { food_item, location, menu, menu_category } from './schema';
import * as schema from '../db/schema';

/**
 * Adds coffee shop locations to the database
 *
 * @param db - The Expo SQLite database instance.
 */
export const addCoffeeShopLocations = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  try {
    // Check if coffee shop locations already exist
    const coffeeShopLocations = await db
      .select()
      .from(location)
      .where(
        sql`${location.name} IN ('Jester Java', 'Longhorn Coffee Co.', 'Prufrock''s', 'Union Coffee House', 'Up and Atom')`
      )
      .execute();

    if (coffeeShopLocations.length > 0) {
      console.log('Coffee shop locations already exist in database');
      return;
    }

    // Insert coffee shop locations
    const coffeeShopLocationValues = [
      { name: 'Jester Java', updated_at: new Date().toISOString() },
      { name: 'Longhorn Coffee Co.', updated_at: new Date().toISOString() },
      { name: "Prufrock's", updated_at: new Date().toISOString() },
      { name: 'Union Coffee House', updated_at: new Date().toISOString() },
      { name: 'Up and Atom', updated_at: new Date().toISOString() },
    ];

    // Insert locations
    const insertedLocations = await db
      .insert(location)
      .values(coffeeShopLocationValues)
      .returning();

    // For each location, create a menu
    for (const loc of insertedLocations) {
      // Add a sample menu for each coffee shop location
      const menuResult = await db
        .insert(menu)
        .values({
          location_id: loc.id,
          name: 'Quick Bites Menu',
        })
        .returning();

      if (menuResult.length > 0) {
        const menuId = menuResult[0].id;

        // Add sample menu categories
        const categoryResult = await db
          .insert(menu_category)
          .values({
            menu_id: menuId,
            title: 'Featured Items',
          })
          .returning();

        if (categoryResult.length > 0) {
          const categoryId = categoryResult[0].id;

          // Add sample food items - common coffee shop items
          let foodItems: { name: string; menu_category_id: number; link: string }[] = [];

          if (loc.name === 'Jester Java') {
            foodItems = [
              { name: 'Breakfast Taco', menu_category_id: categoryId, link: '' },
              { name: 'Starbucks Coffee', menu_category_id: categoryId, link: '' },
              { name: 'Pastry Selection', menu_category_id: categoryId, link: '' },
            ];
          } else if (loc.name === 'Longhorn Coffee Co.') {
            foodItems = [
              { name: 'Iced Coffee', menu_category_id: categoryId, link: '' },
              { name: 'Breakfast Sandwich', menu_category_id: categoryId, link: '' },
              { name: 'Fresh Fruit Cup', menu_category_id: categoryId, link: '' },
            ];
          } else if (loc.name === "Prufrock's") {
            foodItems = [
              { name: 'Study Snack Pack', menu_category_id: categoryId, link: '' },
              { name: 'Caramel Macchiato', menu_category_id: categoryId, link: '' },
              { name: 'Turkey Sandwich', menu_category_id: categoryId, link: '' },
            ];
          } else if (loc.name === 'Union Coffee House') {
            foodItems = [
              { name: 'Vanilla Latte', menu_category_id: categoryId, link: '' },
              { name: 'Chocolate Croissant', menu_category_id: categoryId, link: '' },
              { name: 'Fresh Bagel', menu_category_id: categoryId, link: '' },
            ];
          } else if (loc.name === 'Up and Atom') {
            foodItems = [
              { name: 'Ruta Maya Coffee', menu_category_id: categoryId, link: '' },
              { name: 'Energy Bar', menu_category_id: categoryId, link: '' },
              { name: 'Breakfast Wrap', menu_category_id: categoryId, link: '' },
            ];
          }

          if (foodItems.length > 0) {
            await db.insert(food_item).values(foodItems);
          }
        }
      }
    }

    console.log('Coffee shop locations added to database');
  } catch (error) {
    console.error('Error adding coffee shop locations to database:', error);
  }
};

/**
 * Preserves coffee shop locations when refreshing the database
 *
 * @param db - The Expo SQLite database instance.
 */
export const preserveCoffeeShopLocations = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  try {
    // Save coffee shop locations before clearing the database
    const coffeeShopLocations = await db
      .select()
      .from(location)
      .where(
        sql`${location.name} IN ('Jester Java', 'Longhorn Coffee Co.', 'Prufrock\'s', 'Union Coffee House', 'Up and Atom')`
      )
      .execute();

    if (coffeeShopLocations.length === 0) {
      return false;
    }

    // Delete non-coffee shop locations
    await db
      .delete(location)
      .where(
        sql`${location.name} NOT IN ('Jester Java', 'Longhorn Coffee Co.', 'Prufrock''s', 'Union Coffee House', 'Up and Atom')`
      )
      .execute();

    // Delete menus that don't belong to coffee shop locations
    await db
      .delete(menu)
      .where(sql`${menu.location_id} NOT IN (${coffeeShopLocations.map((l) => l.id).join(',')})`)
      .execute();

    return true;
  } catch (error) {
    console.error('Error preserving coffee shop locations:', error);
    return false;
  }
};
