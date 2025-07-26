import { and, eq } from 'drizzle-orm';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type * as schema from '~/services/database/schema';
import { type Location, type LocationWithType, menu } from '~/services/database/schema';
import { getTodayInCentralTime } from '~/utils/date';
import { isLocationOpen } from '~/utils/time';

export function getLocationOpenStatus(
  location: LocationWithType,
  locationData: Location | null,
  db: ExpoSQLiteDatabase<typeof schema>,
  currentTime: Date = new Date(),
  targetDate?: string,
): boolean {
  // Use provided date or default to today's date in Central Time
  const dateToCheck = targetDate || getTodayInCentralTime();

  // Check if location has menus and if there's menu data for the specific date
  if (location.has_menus) {
    const menuData = db
      .select()
      .from(menu)
      .where(and(eq(menu.location_id, location.id), eq(menu.date, dateToCheck)))
      .get();
    if (!menuData) {
      return false;
    }
  }

  // Check if location is open based on time
  return isLocationOpen(locationData, currentTime);
}
