import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { useDatabase } from '~/hooks/useDatabase';
import * as schema from '~/services/database/schema';

// Type definition for meal times from database
export interface MealTimes {
  breakfast?: { openTime: number; closeTime: number };
  lunch?: { openTime: number; closeTime: number };
  dinner?: { openTime: number; closeTime: number };
}

/**
 * Get location display name from database, with optional colloquial name support
 * @param db - The database instance
 * @param locationName - The original location name
 * @param useColloquial - Whether to use colloquial name if available
 * @returns The display name for the location
 */
export const getLocationName = (
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
 * Get meal times from database for a given location
 * @param db - The database instance
 * @param locationName - The location name
 * @returns The meal times for the location or null if not found
 */
export const getMealTimes = (
  db: ExpoSQLiteDatabase<typeof schema>,
  locationName: string
): MealTimes | null => {
  try {
    const locationData = db
      .select({
        meal_times: schema.location.meal_times,
      })
      .from(schema.location)
      .where(eq(schema.location.name, locationName))
      .get();

    if (locationData?.meal_times) {
      // Parse the meal times array from database format
      const mealTimesArray = locationData.meal_times as {
        name: string;
        start_time: number;
        end_time: number;
      }[];

      // Convert to the expected format
      const mealTimes: MealTimes = {};

      mealTimesArray.forEach((meal) => {
        const mealName = meal.name.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
        mealTimes[mealName] = {
          openTime: meal.start_time,
          closeTime: meal.end_time,
        };
      });

      return mealTimes;
    }

    return null;
  } catch (error) {
    console.error('Error fetching meal times from database:', error);
    return null;
  }
};

/**
 * Hook version for React components that need reactive updates for location names
 */
export const useLocationName = (locationName: string, useColloquial: boolean): string => {
  const db = useDatabase();
  return getLocationName(db, locationName, useColloquial);
};

/**
 * Hook version for React components that need reactive updates for meal times
 */
export const useMealTimes = (locationName: string): MealTimes | null => {
  const db = useDatabase();
  return getMealTimes(db, locationName);
};
