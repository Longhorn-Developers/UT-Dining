import { sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { location } from './schema';
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

    // Insert locations only - no menus
    await db.insert(location).values(coffeeShopLocationValues).returning();

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
        sql`${location.name} IN ('Jester Java', 'Longhorn Coffee Co.', 'Prufrock''s', 'Union Coffee House', 'Up and Atom')`
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

    return true;
  } catch (error) {
    console.error('Error preserving coffee shop locations:', error);
    return false;
  }
};
