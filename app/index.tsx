import { useQuery } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Network from 'expo-network';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View, Text } from 'react-native';
import { Notifier } from 'react-native-notifier';

import * as schema from '../db/schema';
import HomeHeader from './_components/HomeHeader';
import LocationItem from './_components/LocationItem';

import Alert from '~/components/Alert';
import { Container } from '~/components/Container';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { fetchMenuData } from '~/utils/queries';

// Constants
const SPLASH_SCREEN_DURATION = 1000;
const NOTIFICATION_DURATION = 3000;

// Configure splash screen
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: SPLASH_SCREEN_DURATION,
  fade: true,
});

// Types
export type FilterType = 'all' | string;

// Utility functions

// TODO: gotta fix.

const filterLocationsByType = (
  locations: schema.LocationWithType[],
  locationTypes: schema.LocationType[],
  filter: FilterType
) => {
  if (filter === 'all') return locations;

  // Find the location type that matches the filter
  const targetType = locationTypes.find((type) => type.name === filter);
  if (!targetType) return locations;

  // Filter locations by type_id
  return locations.filter((location) => location.type_id === targetType.id);
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  useDrizzleStudio(db);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  // Use TanStack Query for menu/location data
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['menuData'],
    queryFn: () => fetchMenuData(drizzleDb),
    staleTime: 3 * 60 * 60 * 1000, // 3 hour
    refetchInterval: 1000 * 60 * 3, // 3 minutes polling while in app
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Check if user is online before attempting to refetch
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        Notifier.showNotification({
          title: 'No Internet Connection',
          description: 'Please check your connection and try again.',
          duration: NOTIFICATION_DURATION,
          Component: Alert,
        });
        return;
      }

      // Add timeout to refetch operation (10 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      await Promise.race([refetch(), timeoutPromise]);
      setRefreshKey((prev) => prev + 1);

      Notifier.showNotification({
        title: 'Refreshed!',
        description: 'Menu data is up to date.',
        duration: NOTIFICATION_DURATION,
        Component: Alert,
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      const errorMessage =
        error instanceof Error && error.message === 'Request timeout'
          ? 'Request timed out. Please try again.'
          : 'Unable to update data. Please try again.';

      Notifier.showNotification({
        title: 'Refresh Failed',
        description: errorMessage,
        duration: NOTIFICATION_DURATION,
        Component: Alert,
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Handle splash screen
  const onLayoutRootView = () => {
    if (!isLoading && !isFetching) {
      SplashScreen.hide();
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#111827' : '#fff',
        }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#111827' : '#fff',
        }}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
          Failed to load data. Please try again.
        </Text>
      </View>
    );
  }

  const locations = data?.locations || [];
  const locationTypes = data?.locationTypes || [];

  const filteredLocations = filterLocationsByType(locations, locationTypes, selectedFilter);

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container onLayout={onLayoutRootView}>
        <FlatList
          extraData={[currentTime, selectedFilter, refreshKey]}
          data={filteredLocations}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={isDarkMode ? COLORS['ut-grey-dark-mode'] : '#8E8E93'}
            />
          }
          contentContainerClassName="flex gap-y-3"
          renderItem={({ item }) => {
            return (
              <LocationItem
                key={`${item.id}-${refreshKey}`}
                location={item}
                currentTime={currentTime}
              />
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <HomeHeader
              currentTime={currentTime}
              lastUpdated={null}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              showRequeryAlert={false}
              locationTypes={locationTypes}
            />
          }
        />
      </Container>
    </View>
  );
}
