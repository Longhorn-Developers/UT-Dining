import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import SearchBar from './SearchBar';
import TimeSchedule from './TimeSchedule';

import FilterBar from '~/components/FilterBar';
import TopBar from '~/components/TopBar';
import { useDatabase } from '~/hooks/useDatabase';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { menu, location as location_schema } from '~/services/database/schema';
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

    const { useColloquialNames } = useSettingsStore();
    const displayName = useLocationName(location, useColloquialNames);
    const mealTimes = useMealTimes(location);

    const isDarkMode = useSettingsStore((state) => state.isDarkMode);

    useEffect(() => {
      const checkOpen = async () => {
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
    }, [location, locationData]);

    return (
      <View className="mx-6 mt-6 flex gap-y-5">
        <TopBar variant="location" />

        <View className="gap-y-4">
          {/* TEMPORARILY CLOSED Banner */}
          {locationData?.force_close && (
            <View className="rounded-lg bg-red-600 px-4 py-2">
              <Text className="text-center text-lg font-extrabold tracking-wider text-white">
                TEMPORARILY CLOSED
              </Text>
            </View>
          )}

          <View>
            <View className="w-full flex-row flex-wrap items-center  gap-x-3 gap-y-1">
              <Text
                className={cn(
                  'font-sans text-3xl font-extrabold',
                  isDarkMode ? 'text-white' : 'text-black'
                )}>
                {displayName}
              </Text>
            </View>
            <View className="flex-row items-center gap-x-3">
              <Text className="text-lg font-semibold text-ut-burnt-orange">
                {open ? 'Open' : 'Closed'}
              </Text>

              <View
                className={cn(
                  'size-1 rounded-full',
                  isDarkMode ? 'bg-ut-grey-dark-mode' : 'bg-ut-burnt-orange'
                )}
              />

              {/* Location Type Pill */}
              {locationData && locationData.type && (
                <>
                  <View>
                    <View
                      className={cn(
                        'self-start rounded-full px-3 py-1  ',
                        isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-ut-grey/5'
                      )}>
                      <Text
                        className={cn(
                          'text-xs font-bold uppercase',
                          isDarkMode ? 'text-white' : 'text-black/75'
                        )}>
                        {locationData.type}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          <TimeSchedule
            schedule={schedule}
            isOpen={timeDropdownOpen}
            onToggle={() => {
              setTimeDropdownOpen((prev) => !prev);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />

          <View
            className={cn(
              'my-2 h-1 w-full border-b',
              isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15'
            )}
          />

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

            {filters && filters.length >= 1 && <SearchBar query={query} setQuery={setQuery} />}
          </View>
        </View>
      </View>
    );
  }
);

export default LocationHeader;
