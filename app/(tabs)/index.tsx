import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Network from 'expo-network';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Notifier } from 'react-native-notifier';
import Alert from '~/components/Alert';
import { Container } from '~/components/Container';
import OnboardingScreen from '~/components/onboarding/OnboardingScreen';
import { useOnboardingStore } from '~/store/useOnboardingStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { getTodayInCentralTime } from '~/utils/date';
import { getLocationOpenStatus } from '~/utils/locationStatus';
import { fetchMenuData } from '~/utils/queries';
import { cn } from '~/utils/utils';
import * as schema from '../../services/database/schema';
import HomeHeader from '../_components/HomeHeader';
import LocationItem from '../_components/LocationItem';

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

const filterAndSortLocations = (
  locations: schema.LocationWithType[],
  locationTypes: schema.LocationType[],
  filter: FilterType,
  db: DrizzleDB,
  currentTime: Date,
) => {
  // First filter by type
  let filteredLocations = locations;
  if (filter !== 'all') {
    const targetType = locationTypes.find((type) => type.name === filter);
    if (targetType) {
      filteredLocations = locations.filter((location) => location.type_id === targetType.id);
    }
  }

  // Then sort by open/closed status while maintaining original order within each group
  const openLocations: schema.LocationWithType[] = [];
  const closedLocations: schema.LocationWithType[] = [];

  // Get today's date for menu checking
  const todayDate = getTodayInCentralTime();

  filteredLocations.forEach((location) => {
    // Get location data for each location to determine if it's open
    const locationData = db
      .select()
      .from(schema.location)
      .where(eq(schema.location.id, location.id))
      .get();
    if (!locationData) {
      // count as closed, todo: log error
      closedLocations.push(location);
      return;
    }
    const isOpen = getLocationOpenStatus(location, locationData, db, currentTime, todayDate);

    if (isOpen) {
      openLocations.push(location);
    } else {
      closedLocations.push(location);
    }
  });

  // Return open locations first, then closed locations
  return [...openLocations, ...closedLocations];
};

export type DrizzleDB = ExpoSQLiteDatabase<typeof schema> & {
  $client: SQLiteDatabase;
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [layoutLoaded, setLayoutLoaded] = useState(false);
  const isOnboardingComplete = useOnboardingStore((state) => state.isOnboardingComplete);

  const db = useSQLiteContext();
  const drizzleDb: DrizzleDB = drizzle(db, { schema });
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  useDrizzleStudio(db);

  useEffect(() => {
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
    retry: false, // Don't retry on failure - just use cached data
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
    setLayoutLoaded(true);
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (layoutLoaded && !isLoading && !isFetching) {
      console.log('✅ Splash screen hidden');
    }
  }, [layoutLoaded, isLoading, isFetching]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#111827' : '#fff',
        }}
      >
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
        }}
      >
        <Text
          className={cn('font-bold text-lg', isDarkMode ? 'text-white' : 'text-ut-burnt-orange')}
        >
          Failed to load data!
        </Text>

        <Text
          className={cn('mb-4 max-w-64 text-center', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}
        >
          If you just updated the app, close and reopen the app.
        </Text>

        <TouchableOpacity
          onPress={handleRefresh}
          className="rounded-full bg-ut-burnt-orange px-4 py-2"
        >
          <Text className="font-bold text-white">Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const locations = data?.locations || [];
  const locationTypes = data?.locationTypes || [];

  const filteredLocations = filterAndSortLocations(
    locations,
    locationTypes,
    selectedFilter,
    drizzleDb,
    currentTime,
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container disableBottomPadding onLayout={onLayoutRootView}>
        <OnboardingScreen isOnboardingComplete={isOnboardingComplete} />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center">
            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
              Failed to load data. Please try again.
            </Text>
          </View>
        ) : (
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
            contentContainerClassName="flex gap-y-3 pb-8"
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
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                locationTypes={locationTypes}
              />
            }
          />
        )}
      </Container>
    </View>
  );
}
