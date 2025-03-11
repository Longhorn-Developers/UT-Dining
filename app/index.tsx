import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect, useCallback } from 'react';
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
import { COLORS } from '~/utils/colors';
import { shouldRequery } from '~/utils/time';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const sortLocations = (data: schema.Location[]) => {
  // Make a copy of data and sort based on the index in LOCATION_INFO.
  return [...data].sort((a, b) => {
    const indexA = LOCATION_INFO.findIndex((info) => info.name === a.name);
    const indexB = LOCATION_INFO.findIndex((info) => info.name === b.name);
    return indexA - indexB;
  });
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showRequeryAlert, setShowRequeryAlert] = useState(false);

  const [locations, setLocations] = useState<schema.Location[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  // Check if data needs to be refreshed
  useEffect(() => {
    const checkRequery = async () => {
      if (await shouldRequery()) {
        setShowRequeryAlert(true);
      } else {
        setShowRequeryAlert(false);
      }
    };
    checkRequery();
  }, [currentTime, lastUpdated]);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('Preparing app...');
        await insertDataIntoSQLiteDB(drizzleDb);
        const data = await drizzleDb.select().from(schema.location);
        setLocations(data);

        const lastUpdated = miscStorage.getString('lastQueryTime');

        if (lastUpdated) {
          setLastUpdated(new Date(lastUpdated));
        }
        console.log('Data initialized!');
      } catch (e) {
        console.warn(e);
      } finally {
        console.log('App is ready!');
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  // Update current time every minute to refresh the message
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await insertDataIntoSQLiteDB(drizzleDb, true);
    setCurrentTime(new Date());
    setLastUpdated(new Date());
    setShowRequeryAlert(false); // Reset alert after refreshing
    setRefreshing(false);

    Notifier.showNotification({
      title: 'Data Refreshed!',
      description: 'The menu data has been refreshed.',
      duration: 3000,
      Component: Alert,
    });
  };

  if (!locations)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS['ut-burnt-orange']} />
      </View>
    );

  const sortedData = sortLocations(locations);

  const filteredData =
    selectedFilter === 'all'
      ? sortedData
      : sortedData.filter((item) => {
          const locationInfo = LOCATION_INFO.find((info) => info.name === item.name);
          if (!locationInfo) return false;
          if (selectedFilter === 'dining') return locationInfo.type === 'Dining Hall';
          if (selectedFilter === 'restaurants') return locationInfo.type === 'Restaurant';
          if (selectedFilter === 'convenience') return locationInfo.type === 'Convenience Store';
          return false;
        });

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      <Container onLayout={onLayoutRootView}>
        <FlatList
          extraData={[currentTime, selectedFilter]}
          data={filteredData}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
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
    </>
  );
}
