import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';

import SearchBar from './SearchBar';
import TimeSchedule from './TimeSchedule';

import FilterBar from '~/components/FilterBar';
import TopBar from '~/components/TopBar';
import { LOCATION_INFO, getLocationName } from '~/data/LocationInfo';
import { menu, location as location_schema } from '~/db/schema';
import { useDatabase } from '~/hooks/useDatabase';
import { useSettingsStore } from '~/store/useSettingsStore';
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
    const schedule = useMemo(() => generateSchedule(location), [location]);
    const locationInfo = LOCATION_INFO.find((loc) => loc.name === location);
    const { useColloquialNames } = useSettingsStore();
    const isCoffeeShop = locationInfo?.type === 'Coffee Shop';
    const isDarkMode = useSettingsStore((state) => state.isDarkMode);

    useEffect(() => {
      const checkOpen = async () => {
        // Checking if there are any menus for the location
        // Get location id
        const locationData = db
          .select()
          .from(location_schema)
          .where(eq(location_schema.name, location))
          .get();

        if (!locationData) {
          setOpen(false);
          return;
        }

        const res = db.select().from(menu).where(eq(menu.location_id, locationData.id)).get();

        if (!res) {
          setOpen(false);
          return;
        }

        setOpen(isLocationOpen(location));
      };

      checkOpen();
    }, [location]);

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
                  {getLocationName(location, useColloquialNames)}
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
                  mealTimes={locationInfo?.mealTimes}
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
