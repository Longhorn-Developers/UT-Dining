import { sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { location } from './schema';
import * as schema from '../db/schema';

// add coffee shop locations to the database
export const addCoffeeShopLocations = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  try {
    // Get existing coffee shop locations
    const existingLocations = await db
      .select()
      .from(location)
      .where(
        sql`${location.name} IN ('Jester Java', 'Longhorn Coffee Co.', 'Prufrock''s', 'Union Coffee House', 'Up and Atom', 'Shake Smart')`
      )
      .execute();

    const existingNames = new Set(existingLocations.map((loc) => loc.name));

    // Filter out locations that already exist
    const coffeeShopLocationValues = [
      { name: 'Jester Java', updated_at: new Date().toISOString() },
      { name: 'Longhorn Coffee Co.', updated_at: new Date().toISOString() },
      { name: "Prufrock's", updated_at: new Date().toISOString() },
      { name: 'Union Coffee House', updated_at: new Date().toISOString() },
      { name: 'Up and Atom', updated_at: new Date().toISOString() },
      { name: 'Shake Smart', updated_at: new Date().toISOString() },
    ].filter((loc) => !existingNames.has(loc.name));

    if (coffeeShopLocationValues.length > 0) {
      // Insert only new locations with ON CONFLICT DO NOTHING
      await db
        .insert(location)
        .values(coffeeShopLocationValues)
        .onConflictDoNothing({ target: location.name })
        .returning();
      console.log('New coffee shop locations added to database');
    } else {
      console.log('All coffee shop locations already exist in database');
    }
  } catch (error) {
    console.error('Error adding coffee shop locations to database:', error);
  }
};
