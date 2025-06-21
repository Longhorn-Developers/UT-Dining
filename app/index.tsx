import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { Notifier } from 'react-native-notifier';

import * as schema from '../db/schema';
import HomeHeader from './components/HomeHeader';
import LocationItem from './components/LocationItem';

import Alert from '~/components/Alert';
import { Container } from '~/components/Container';
import { LOCATION_INFO } from '~/data/LocationInfo';
import { insertDataIntoSQLiteDB } from '~/db/database';
import { miscStorage } from '~/store/misc-storage';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { shouldRequery } from '~/utils/time';

// Constants
const TIME_UPDATE_INTERVAL = 10000;
const SPLASH_SCREEN_DURATION = 1000;
const NOTIFICATION_DURATION = 3000;

// Configure splash screen
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: SPLASH_SCREEN_DURATION,
  fade: true,
});

// Types
export type FilterType = 'all' | 'dining' | 'restaurants' | 'convenience' | 'coffee';

// Utility functions
const sortLocations = (data: schema.Location[]): schema.Location[] => {
  return [...data].sort((a, b) => {
    const indexA = LOCATION_INFO.findIndex((info) => info.name === a.name);
    const indexB = LOCATION_INFO.findIndex((info) => info.name === b.name);
    return indexA - indexB;
  });
};

const filterLocationsByType = (
  locations: schema.Location[],
  filter: FilterType
): schema.Location[] => {
  if (filter === 'all') return locations;

  return locations.filter((item) => {
    const locationInfo = LOCATION_INFO.find((info) => info.name === item.name);
    if (!locationInfo) return false;

    const typeMap: Record<string, string> = {
      dining: 'Dining Hall',
      restaurants: 'Restaurant',
      convenience: 'Convenience Store',
      coffee: 'Coffee Shop',
    };

    return locationInfo.type === typeMap[filter];
  });
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showRequeryAlert, setShowRequeryAlert] = useState(false);
  const [locations, setLocations] = useState<schema.Location[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  useDrizzleStudio(db);

  // Initialize app data
  const initializeApp = async () => {
    try {
      console.log('🚀 Preparing app...');

      await insertDataIntoSQLiteDB(drizzleDb);
      const data = await drizzleDb.select().from(schema.location);
      setLocations(data);

      const storedLastUpdated = miscStorage.getString('lastQueryTime');
      if (storedLastUpdated) {
        setLastUpdated(new Date(storedLastUpdated));
      }

      console.log('✅ Data initialized!');
    } catch (error) {
      console.warn('⚠️ Error initializing app:', error);
    } finally {
      console.log('🎉 App is ready!');
      setAppIsReady(true);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setRefreshing(true);

    try {
      await insertDataIntoSQLiteDB(drizzleDb, true);
      const now = new Date();
      setCurrentTime(now);
      setLastUpdated(now);
      setShowRequeryAlert(false);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Notifier.showNotification({
        title: 'Refreshed!',
        description: 'Menu data is up to date.',
        duration: NOTIFICATION_DURATION,
        Component: Alert,
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle splash screen
  const onLayoutRootView = () => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  };

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Check if requery is needed
  useEffect(() => {
    const checkRequery = async () => {
      const needsRequery = await shouldRequery();
      setShowRequeryAlert(needsRequery);
    };

    checkRequery();
  }, [currentTime, lastUpdated]);

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, TIME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (!locations) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS['ut-burnt-orange']} />
      </View>
    );
  }

  // Don't render until ready
  if (!appIsReady) {
    return null;
  }

  // Prepare data
  const sortedLocations = sortLocations(locations);
  const filteredLocations = filterLocationsByType(sortedLocations, selectedFilter);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? '#111827' : '#fff',
      }}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container onLayout={onLayoutRootView}>
        <FlatList
          extraData={[currentTime, selectedFilter]}
          data={filteredLocations}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS['ut-burnt-orange']]}
              tintColor={COLORS['ut-burnt-orange']}
            />
          }
          contentContainerClassName="flex gap-y-3"
          renderItem={({ item }) => {
            const locationInfo = LOCATION_INFO.find((info) => info.name === item.name);
            if (!locationInfo) return null;
            return <LocationItem location={item} currentTime={currentTime} />;
          }}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <HomeHeader
              currentTime={currentTime}
              lastUpdated={lastUpdated}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              showRequeryAlert={showRequeryAlert}
            />
          }
        />
      </Container>
    </View>
  );
}
