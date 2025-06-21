import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import * as schema from '~/db/schema';
import { useDatabase } from '~/hooks/useDatabase';

/**
 * Get location display name from database, with optional colloquial name support
 * @param db - The database instance
 * @param locationName - The original location name
 * @param useColloquial - Whether to use colloquial name if available
 * @returns The display name for the location
 */
export const getLocationNameFromDB = (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string,
  useColloquial: boolean
): string => {
  if (!useColloquial) return locationName;

  try {
    const locationData = db
      .select({
        name: schema.location.name,
        colloquial_name: schema.location.colloquial_name,
      })
      .from(schema.location)
      .where(eq(schema.location.name, locationName))
      .get();

    if (locationData?.colloquial_name) {
      return locationData.colloquial_name;
    }

    return locationName;
  } catch (error) {
    console.error('Error fetching location name from database:', error);
    return locationName; // Fallback to original name
  }
};

/**
 * Hook version for React components that need reactive updates
 */
export const useLocationNameFromDB = (locationName: string, useColloquial: boolean): string => {
  const db = useDatabase();

  if (!useColloquial) return locationName;

  try {
    const locationData = db
      .select({
        name: schema.location.name,
        colloquial_name: schema.location.colloquial_name,
      })
      .from(schema.location)
      .where(eq(schema.location.name, locationName))
      .get();

    if (locationData?.colloquial_name) {
      return locationData.colloquial_name;
    }

    return locationName;
  } catch (error) {
    console.error('Error fetching location name from database:', error);
    return locationName; // Fallback to original name
  }
};
