import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as Network from 'expo-network';

import * as schema from '../services/database/schema';

import { insertDataIntoSQLiteDB } from '~/services/database/database';

export const fetchMenuData = async (drizzleDb: ExpoSQLiteDatabase<typeof schema>) => {
  // If there is no internet, skip data insertion
  if (!(await Network.getNetworkStateAsync()).isConnected) {
    throw new Error('No internet connection');
  }

  await insertDataIntoSQLiteDB(drizzleDb); // Always force refresh for query

  // Fetch locations and location types concurrently
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
        }))
      ),
    drizzleDb.select().from(schema.location_type).orderBy(schema.location_type.display_order),
  ]);

  return { locations: data, locationTypes: types };
};
