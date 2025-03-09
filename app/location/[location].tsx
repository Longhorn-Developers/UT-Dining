import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import CategoryHeader from './components/CategoryHeader';
import LocationHeader from './components/LocationHeader';
import SkeletonItem from './components/SkeletonItem';
import { useCategoryExpansion } from '../../hooks/useCategoryExpansion';
import { useLocationData } from '../../hooks/useLocationData';

import { Container } from '~/components/Container';
import FoodComponent from '~/components/FoodComponent';

const Location = () => {
  const { location } = useLocalSearchParams<{ location: string }>();

  // Custom hooks for data and state management
  const { data, loading, selectedMenu, setSelectedMenu, filters } = useLocationData(location);

  const { toggleCategory, flattenedItems, resetExpandedCategories } = useCategoryExpansion(data);

  // Reset expanded categories when selectedMenu changes
  useEffect(() => {
    resetExpandedCategories();
  }, [selectedMenu, resetExpandedCategories]);

  // Create skeletons for loading state
  const skeletonItems = React.useMemo(() => {
    const items = [];
    // Create 5 categories with random number of items each
    for (let i = 0; i < 5; i++) {
      items.push({ type: 'skeleton_header', id: `skeleton-header-${i}` });

      // Generate random number of items between 7 and 10
      const itemCount = Math.floor(Math.random() * 6) + 3;

      for (let j = 0; j < itemCount; j++) {
        items.push({ type: 'skeleton_item', id: `skeleton-item-${i}-${j}` });
      }
    }
    return items;
  }, []);

  // Render individual list item
  const renderItem = React.useCallback(
    ({ item }: { item: any }) => {
      if (item.type === 'category_header') {
        return (
          <View className="mt-4 px-6">
            <CategoryHeader
              title={item.title}
              isExpanded={item.isExpanded}
              onToggle={() => {
                toggleCategory(item.id);
              }}
            />
          </View>
        );
      } else if (item.type === 'food_item') {
        return (
          <View className="px-6">
            <FoodComponent
              food={item.data}
              selectedMenu={selectedMenu as string}
              categoryName={item.categoryId}
              location={location as string}
            />
          </View>
        );
      } else if (item.type === 'skeleton_header') {
        return <SkeletonItem isHeader />;
      } else if (item.type === 'skeleton_item') {
        return <SkeletonItem />;
      }
      return null;
    },
    [selectedMenu, location, toggleCategory]
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Location' }} />
      <Container className="mx-0 flex-1">
        <FlashList
          showsVerticalScrollIndicator
          estimatedItemSize={80}
          data={loading ? skeletonItems : flattenedItems}
          ListHeaderComponent={
            <LocationHeader
              location={location}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              filters={filters}
            />
          }
          ListEmptyComponent={
            loading ? null : (
              <View className="mt-12 flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-ut-burnt-orange">No items found.</Text>
                <Text className="text-sm">Please try again later.</Text>
              </View>
            )
          }
          renderItem={renderItem}
          getItemType={(item) => ('type' in item ? item.type : 'unknown')}
        />
      </Container>
    </>
  );
};

export default Location;
