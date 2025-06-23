import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Stack, router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Notifier } from 'react-native-notifier';

import Alert from '~/components/Alert';
import { Container } from '~/components/Container';
import FoodComponent from '~/components/FoodComponent';
import TopBar from '~/components/TopBar';
import { toggleFavorites } from '~/db/database';
import * as schema from '~/db/schema';
import { useDatabase } from '~/hooks/useDatabase';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const Favorites = () => {
  const db = useDatabase();
  const { data: favorites } = useLiveQuery(db.select().from(schema.favorites));
  const [loading, setLoading] = useState(true);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  useEffect(() => {
    if (favorites) {
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, []);

  // Sort favorites by date added (newest first)
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort(
      (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
    );
  }, [favorites]);

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      <Stack.Screen
        options={{
          title: 'Favorites',
          headerShown: false,
        }}
      />
      <Container className="mx-0 mb-12">
        <View className="mt-6 flex gap-y-5 px-6">
          <TopBar variant="back" />
          <View>
            <View className="flex-row items-center gap-x-2">
              <Text
                className={cn('text-3xl font-extrabold', isDarkMode ? 'text-white' : 'text-black')}>
                Your Favorites
              </Text>
              <Heart size={20} color={COLORS['ut-burnt-orange']} fill={COLORS['ut-burnt-orange']} />
            </View>
            <Text className={cn('font-medium', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
              Your favorite campus dishes are saved here! Look for the heart icon in menus. Swipe
              left to remove.
            </Text>
          </View>

          <View
            className={cn(
              'my-1 w-full border-b',
              isDarkMode ? 'border-gray-700' : 'border-ut-grey/15'
            )}
          />
        </View>
        <FlashList
          data={sortedFavorites}
          renderItem={({ item }) => (
            <View className="px-6">
              <FoodComponent
                categoryName={item.category_name}
                food={{
                  name: item.name,
                  // These are empty because we don't have full nutrition data in favorites
                  // You could modify to store this if needed
                  nutrition: {} as any,
                  allergens: {} as any,
                  link: '',
                }}
                location={item.location_name}
                // Check if item.menuName is a string, otherwise convert it
                selectedMenu={item.menu_name}
                showExtraInfo={false}
                canMealPlan={false}
                isFavorite
                isFavoriteScreen
                onFavorite={async (food) => {
                  Notifier.showNotification({
                    title: `${food.name} removed from Favorites!`,
                    description: 'You removed this item from your favorites.',
                    swipeEnabled: true,
                    Component: Alert,
                    duration: 3000,
                    queueMode: 'immediate',
                  });

                  // Toggle in database
                  await toggleFavorites(
                    db,
                    food,
                    item.location_name,
                    item.menu_name,
                    item.category_name
                  );
                }}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-12 flex items-center justify-center">
              {loading ? (
                <Text className="text-xl font-bold text-ut-burnt-orange">Loading...</Text>
              ) : (
                <>
                  {favorites.length === 0 && (
                    <Text className="text-lg font-bold text-ut-burnt-orange">
                      No Favorites Yet!
                    </Text>
                  )}

                  <Text
                    className={cn(
                      'mb-6 max-w-64 text-center',
                      isDarkMode ? 'text-gray-300' : 'text-ut-grey'
                    )}>
                    Find your favorite dishes by browsing dining locations.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      router.dismissTo('/');
                    }}
                    className="rounded-full bg-ut-burnt-orange px-4 py-2">
                    <Text className="font-bold text-white">Browse Dining Locations</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
        />
      </Container>
    </View>
  );
};

export default Favorites;
