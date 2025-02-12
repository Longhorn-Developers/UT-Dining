import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';

const Favorites = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Favorites' }} />
      <Container>
        <FlatList
          ListHeaderComponent={
            <View className="mt-6 flex gap-y-5">
              {/* need to make favorites variant */}
              <TopBar variant="home" />

              <Text className="text-3xl font-extrabold">Favorites</Text>
            </View>
          }
          data={[
            {
              id: '1',
              name: 'Favorite 1',
            },
            {
              id: '2',
              name: 'Favorite 2',
            },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <></>}
        />
      </Container>
    </>
  );
};

export default Favorites;
