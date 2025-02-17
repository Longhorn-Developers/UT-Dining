import { Stack } from 'expo-router';
import { HeartIcon } from 'lucide-react-native';
import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Container } from '~/components/Container';
import FoodComponent from '~/components/FoodComponent';
import TopBar from '~/components/TopBar';
import { useDataStore } from '~/store/useDataStore';
import { COLORS } from '~/utils/colors';

const Favorites = () => {
  const { favoriteFoodItems } = useDataStore();

  return (
    <>
      <Stack.Screen options={{ title: 'Favorites' }} />
      <Container>
        <FlatList
          ListHeaderComponent={
            <View className="my-6 flex gap-y-5">
              <TopBar variant="back" />
              <View>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-3xl font-extrabold">Your Favorites</Text>
                  <HeartIcon
                    size={20}
                    color={COLORS['ut-burnt-orange']}
                    fill={COLORS['ut-burnt-orange']}
                  />
                </View>
                <Text className="font-medium text-ut-grey">
                  Swipe left on a food item to add it to your favorites. Swipe left again to remove
                  it.
                </Text>
              </View>

              <View className="my-1 w-full border-b border-b-ut-grey/15" />
            </View>
          }
          data={favoriteFoodItems}
          renderItem={({ item }) => (
            <FoodComponent
              categoryName={item.categoryName}
              food={item}
              location={item.locationName}
              selectedMenu={item.menuName}
            />
          )}
          ListEmptyComponent={
            <View className="mt-12 flex items-center justify-center">
              <Text className="text-lg font-bold text-ut-burnt-orange">No Favorites!</Text>
              <Text className="max-w-64 text-center text-ut-grey">
                Swipe right on a food item to add to your favorites.
              </Text>
            </View>
          }
        />
      </Container>
    </>
  );
};

export default Favorites;
