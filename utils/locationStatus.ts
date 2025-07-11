import { eq } from 'drizzle-orm';

import { LocationWithType, menu, Location } from '~/services/database/schema';
import { isLocationOpen } from '~/utils/time';

export function getLocationOpenStatus(
  location: LocationWithType,
  locationData: Location | null,
  db: any,
  currentTime: Date = new Date()
): boolean {
  // Check if location has menus and if there's menu data
  if (location.has_menus) {
    const menuData = db.select().from(menu).where(eq(menu.location_id, location.id)).get();
    if (!menuData) {
      return false;
    }
  }

  // Check if location is open based on time
  return isLocationOpen(locationData, currentTime);
}
