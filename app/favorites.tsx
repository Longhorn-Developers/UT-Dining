import { FlashList } from '@shopify/flash-list';
import { Stack, router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Container } from '~/components/Container';
import FoodComponent from '~/components/FoodComponent';
import TopBar from '~/components/TopBar';
import { useFavoritesStore } from '~/store/useFavoritesStore';
import { COLORS } from '~/utils/colors';

const Favorites = () => {
  const { favorites, initialized } = useFavoritesStore();

  // Sort favorites by date added (newest first)
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }, [favorites]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Favorites',
          headerShown: false,
        }}
      />
      <Container>
        <FlashList
          estimatedItemSize={100}
          ListHeaderComponent={
            <View className="my-6 flex gap-y-5">
              <TopBar variant="back" />
              <View>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-3xl font-extrabold">Your Favorites</Text>
                  <Heart
                    size={20}
                    color={COLORS['ut-burnt-orange']}
                    fill={COLORS['ut-burnt-orange']}
                  />
                </View>
                <Text className="font-medium text-ut-grey">
                  Your favorite campus dishes are saved here! Look for the heart icon in menus.
                  Swipe left to remove.
                </Text>
              </View>

              <View className="my-1 w-full border-b border-b-ut-grey/15" />
            </View>
          }
          data={sortedFavorites}
          renderItem={({ item }) => (
            <View>
              <FoodComponent
                categoryName={item.categoryName}
                food={{
                  name: item.name,
                  // These are empty because we don't have full nutrition data in favorites
                  // You could modify to store this if needed
                  nutrition: {} as any,
                  allergens: {} as any,
                  link: 'https://example.com',
                }}
                location={item.locationName}
                // Check if item.menuName is a string, otherwise convert it
                selectedMenu={item.menuName}
                showExtraInfo={false}
                canMealPlan={false}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-12 flex items-center justify-center">
              <Text className="text-lg font-bold text-ut-burnt-orange">
                {initialized ? 'No Favorites Yet!' : 'Loading...'}
              </Text>
              {initialized && (
                <>
                  <Text className="mb-6 max-w-64 text-center text-ut-grey">
                    Find your favorite dishes by browsing dining locations.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/')}
                    className="rounded-full bg-ut-burnt-orange px-4 py-2">
                    <Text className="font-bold text-white">Browse Dining Locations</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
        />
      </Container>
    </>
  );
};

export default Favorites;
