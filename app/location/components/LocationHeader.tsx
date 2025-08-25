import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import FilterBar from '~/components/FilterBar';
import TopBar from '~/components/TopBar';
import { useDatabase } from '~/hooks/useDatabase';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { location as location_schema, menu } from '~/services/database/schema';
import { useSettingsStore } from '~/store/useSettingsStore';
import { useLocationName } from '~/utils/locations';
import { generateSchedule, isLocationOpen } from '~/utils/time';
import { cn } from '~/utils/utils';
import DateNavigator from './DateNavigator';
import SearchBar from './SearchBar';
import TimeSchedule from './TimeSchedule';

interface LocationHeaderProps {
  location: string;
  selectedMenu: string | null;
  setSelectedMenu: (menu: string) => void;
  filters: { title: string; id: string }[];
  query: string;
  setQuery: (query: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const LocationHeader = React.memo(
  ({
    location,
    selectedMenu,
    setSelectedMenu,
    filters,
    query,
    setQuery,
    selectedDate,
    onDateChange,
  }: LocationHeaderProps) => {
    const [open, setOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const db = useDatabase();
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const { locationData } = useLocationDetails(location);
    const schedule = generateSchedule(locationData, true);

    const { useColloquialNames } = useSettingsStore();
    const displayName = useLocationName(location, useColloquialNames);

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
    }, [location, locationData, db.select]);

    return (
      <View className="mx-6 mt-6 flex gap-y-5">
        {/* Content that's hidden when search is focused */}
        {!isSearchFocused && (
          <>
            <TopBar variant="location" />

            <View className="gap-y-4">
              {/* Temporarily Closed Banner */}
              {locationData?.force_close && (
                <View className="rounded-lg bg-red-600 px-4 py-2">
                  <Text className="text-center font-extrabold text-lg text-white tracking-wider">
                    TEMPORARILY CLOSED
                  </Text>
                </View>
              )}

              {/* Location Header */}
              <View>
                <View className="mb-1 w-full flex-row flex-wrap items-center gap-x-3 gap-y-1">
                  <Text
                    className={cn(
                      'font-extrabold font-sans text-3xl',
                      isDarkMode ? 'text-white' : 'text-black',
                    )}
                  >
                    {displayName}
                  </Text>
                </View>
                <View className="flex-row items-center gap-x-3">
                  <Text className="font-semibold text-lg text-ut-burnt-orange">
                    {open ? 'Open' : 'Closed'}
                  </Text>

                  <View
                    className={cn(
                      'size-1 rounded-full',
                      isDarkMode ? 'bg-ut-grey-dark-mode' : 'bg-ut-burnt-orange',
                    )}
                  />

                  {/* Location Type Pill */}
                  {locationData?.type && (
                    <View
                      className={cn(
                        'self-start rounded-full px-3 py-1',
                        isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-ut-grey/5',
                      )}
                    >
                      <Text
                        className={cn(
                          'font-bold text-xs uppercase',
                          isDarkMode ? 'text-white' : 'text-black/75',
                        )}
                      >
                        {locationData.type}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Time Schedule */}
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
                  'my-0 h-1 w-full border-b',
                  isDarkMode ? 'border-neutral-800' : 'border-b-ut-grey/15',
                )}
              />

              {/* Date Navigator */}
              <DateNavigator selectedDate={selectedDate} onDateChange={onDateChange} />
            </View>
          </>
        )}

        {/* Search Bar - always visible when filters exist */}
        {filters && filters.length >= 1 && (
          <View className="gap-y-3">
            <SearchBar
              query={query}
              setQuery={setQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              isSearchFocused={isSearchFocused}
            />
          </View>
        )}

        {/* Filter Bar - only visible when search is not focused */}
        {!isSearchFocused && filters && filters.length >= 1 && (
          <View className="gap-y-3">
            <View className="flex-row items-center justify-between">
              <FilterBar
                selectedItem={selectedMenu as string}
                setSelectedItem={setSelectedMenu}
                items={filters}
                showFilterButton
              />
            </View>
          </View>
        )}
      </View>
    );
  },
);

export default LocationHeader;
