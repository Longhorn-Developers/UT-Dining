import { eq } from 'drizzle-orm';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as Network from 'expo-network';
import { insertDataIntoSQLiteDB } from '~/services/database/database';
import * as schema from '../services/database/schema';

export const fetchMenuData = async (drizzleDb: ExpoSQLiteDatabase<typeof schema>) => {
  // Check internet connection and only sync when online
  const networkState = await Network.getNetworkStateAsync();
  if (networkState.isConnected) {
    try {
      await insertDataIntoSQLiteDB(drizzleDb); // Sync with remote when online
    } catch (error) {
      console.warn('Failed to sync with remote database, using cached data:', error);
      // Continue to return cached data even if sync fails
    }
  }

  // Always return cached data from SQLite (works both online and offline)
  const [data, types] = await Promise.all([
    drizzleDb
      .select()
      .from(schema.location)
      .innerJoin(schema.location_type, eq(schema.location.type_id, schema.location_type.id))
      .orderBy(schema.location.display_order)
      .then((joinedData) =>
        joinedData.map(({ location, location_type }) => ({
          ...location,
          type: location_type.name,
        })),
      ),
    drizzleDb.select().from(schema.location_type).orderBy(schema.location_type.display_order),
  ]);

  return { locations: data, locationTypes: types };
};
