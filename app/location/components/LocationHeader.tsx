import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import SearchBar from './SearchBar';
import TimeSchedule from './TimeSchedule';

import FilterBar from '~/components/FilterBar';
import TopBar from '~/components/TopBar';
import { menu, location as location_schema } from '~/db/schema';
import { useDatabase } from '~/hooks/useDatabase';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useSettingsStore } from '~/store/useSettingsStore';
import { useLocationName, useMealTimes } from '~/utils/locations';
import { generateSchedule, isLocationOpen } from '~/utils/time';
import { cn } from '~/utils/utils';

interface LocationHeaderProps {
  location: string;
  selectedMenu: string | null;
  setSelectedMenu: (menu: string) => void;
  filters: { title: string; id: string }[];
  query: string;
  setQuery: (query: string) => void;
}

const LocationHeader = React.memo(
  ({ location, selectedMenu, setSelectedMenu, filters, query, setQuery }: LocationHeaderProps) => {
    const [open, setOpen] = useState(false);
    const db = useDatabase();
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const { locationData } = useLocationDetails(location);
    const schedule = generateSchedule(locationData, true);
    // const locationInfo = LOCATION_INFO.find((loc) => loc.name === location);
    const { useColloquialNames } = useSettingsStore();
    const displayName = useLocationName(location, useColloquialNames);
    const mealTimes = useMealTimes(location);
    // const isCoffeeShop = locationInfo?.type === 'Coffee Shop';
    const isCoffeeShop = false;
    const isDarkMode = useSettingsStore((state) => state.isDarkMode);

    useEffect(() => {
      const checkOpen = async () => {
        // For coffee shops, use database data directly
        if (isCoffeeShop) {
          setOpen(isLocationOpen(locationData));
          return;
        }

        // For other locations, check if there are any menus
        // Get location id
        const locationDbData = db
          .select()
          .from(location_schema)
          .where(eq(location_schema.name, location))
          .get();

        if (!locationDbData) {
          setOpen(false);
          return;
        }

        const res = db.select().from(menu).where(eq(menu.location_id, locationDbData.id)).get();

        if (!res) {
          setOpen(false);
          return;
        }

        setOpen(isLocationOpen(locationData));
      };

      checkOpen();
    }, [location, locationData, isCoffeeShop]);

    return (
      <View className="mx-6 mt-6 flex gap-y-5">
        <TopBar variant="location" />

        {!isCoffeeShop && (
          <View className="gap-y-4">
            <View>
              <View className="w-full flex-row items-center justify-between">
                <Text
                  className={cn(
                    'font-sans text-3xl font-extrabold',
                    isDarkMode ? 'text-white' : 'text-black'
                  )}>
                  {displayName}
                </Text>
              </View>
              <Text className="text-lg font-semibold text-ut-burnt-orange">
                {open ? 'Open' : 'Closed'}
              </Text>
            </View>

            <TimeSchedule
              schedule={schedule}
              isOpen={timeDropdownOpen}
              onToggle={() => {
                setTimeDropdownOpen((prev) => !prev);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />

            <View className="my-1 w-full border-b border-b-ut-grey/15" />

            <View className="gap-y-3">
              <View className="flex-row items-center justify-between">
                <FilterBar
                  selectedItem={selectedMenu as string}
                  setSelectedItem={setSelectedMenu}
                  useTimeOfDayDefault={filters.length > 1}
                  items={filters}
                  mealTimes={mealTimes || undefined}
                  showFilterButton
                />
              </View>

              {filters && filters.length > 1 && <SearchBar query={query} setQuery={setQuery} />}
            </View>
          </View>
        )}
      </View>
    );
  }
);

export default LocationHeader;
