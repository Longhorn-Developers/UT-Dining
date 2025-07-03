import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Notifier } from 'react-native-notifier';

import Alert from '~/components/Alert';
import FoodComponent from '~/components/FoodComponent';
import { FoodItem, toggleFavorites } from '~/db/database';
import * as schema from '~/db/schema';

// Define interfaces for the props
interface FoodItemProps {
  data: FoodItem;
  categoryId: string;
  id: string;
  hidden?: boolean;
}

interface FoodItemRowProps {
  item: FoodItemProps;
  selectedMenu: string;
  location: string;
  db: ExpoSQLiteDatabase<typeof schema>;
  favorites: { name: string; [key: string]: any }[];
}

const FoodItemRow = ({ item, selectedMenu, location, db, favorites }: FoodItemRowProps) => {
  const foodName = item.data.name;
  // Use state for favorite status
  const [isFavorite, setIsFavorite] = useState(favorites.some((f) => f.name === foodName));

  // Update local state when favorites change
  useEffect(() => {
    setIsFavorite(favorites.some((f) => f.name === foodName));
  }, [favorites, foodName]);

  return (
    <View className="px-6">
      <FoodComponent
        food={item.data}
        selectedMenu={selectedMenu}
        categoryName={item.categoryId}
        location={location}
        onFavorite={async (food) => {
          // Update local state immediately for a responsive UI
          const newFavoriteState = !isFavorite;

          // Prepare notification content before showing
          const title = newFavoriteState
            ? `${food.name} added to Favorites!`
            : `${food.name} removed from Favorites!`;

          const description = newFavoriteState
            ? 'Tap the heart (top right) to view your saved favorites.'
            : 'You removed this item from your favorites.';

          // Use setTimeout to ensure UI updates before showing notification
          setTimeout(() => {
            Notifier.showNotification({
              title,
              description,
              swipeEnabled: true,
              Component: Alert,
              duration: 3000,
              queueMode: 'immediate',
            });
          }, 1);

          // Update state after preparing the notification
          setIsFavorite(newFavoriteState);

          // Toggle in database
          await toggleFavorites(db, food, location, selectedMenu, item.categoryId);
        }}
        isFavorite={isFavorite}
      />
    </View>
  );
};

export default FoodItemRow;
