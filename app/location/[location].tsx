import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text } from 'react-native';

import CategoryHeader from './components/CategoryHeader';
import FoodItemRow from './components/FoodItemRow';
import LocationHeader from './components/LocationHeader';
import ScrollToTopButton from './components/ScrollToTopButton';
import SkeletonItem from './components/SkeletonItem';
import { useCategoryExpansion } from '../../hooks/useCategoryExpansion';
import { useLocationData } from '../../hooks/useLocationData';
import { useScrollToTop } from '../../hooks/useScrollToTop';

import { Container } from '~/components/Container';
import * as schema from '~/db/schema';
import { useDatabase } from '~/hooks/useDatabase';
import { useDebounce } from '~/hooks/useDebounce';
import { useFiltersStore } from '~/store/useFiltersStore';
import { filterFoodItems } from '~/utils/filter';

/**
 * Filter items based on search query and user-selected filters
 */
const useFilteredItems = (
  flattenedItems: any[],
  debouncedSearchQuery: string,
  filters: any,
  favorites: any[]
) => {
  return React.useMemo(() => {
    // First, filter by search query
    let result = flattenedItems;

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = [];
      const processedCategoryIds = new Set();
      let currentCategory = null;

      for (const item of flattenedItems) {
        if (item.type === 'category_header') {
          currentCategory = { ...item, isExpanded: true };
        } else if (item.type === 'food_item') {
          const foodName = item.data.name ? item.data.name.toLowerCase() : '';
          const description = item.data.description ? item.data.description.toLowerCase() : '';

          if (foodName.includes(query) || description.includes(query)) {
            if (currentCategory && !processedCategoryIds.has(currentCategory.id)) {
              // Always expand categories in search results
              result.push({
                ...currentCategory,
                isExpanded: true,
              });
              processedCategoryIds.add(currentCategory.id);
            }
            // Don't mark items as hidden in search results
            result.push({
              ...item,
              hidden: false,
            });
          }
        }
      }
    }

    // Then, apply additional filters (favorites, allergens, dietary)
    if (
      Object.values(filters).some(
        (val) =>
          val === true ||
          (typeof val === 'object' && val !== null && Object.values(val).some((v) => v))
      )
    ) {
      const filteredCategories = new Set();
      const filteredResult = [];
      let currentCategory = null;

      for (const item of result) {
        if (item.type === 'category_header') {
          // Don't add category headers yet, we'll add them if they have matching items
          currentCategory = item;
        } else if (item.type === 'food_item') {
          // Apply additional filters to food items
          const foodItem = item.data;

          // Use our utility function to check if this item passes all filters
          if (filterFoodItems([foodItem], filters, favorites).length > 0) {
            // Item passed all filters, so add its category header if not already added
            if (currentCategory && !filteredCategories.has(currentCategory.id)) {
              filteredResult.push(currentCategory);
              filteredCategories.add(currentCategory.id);
            }
            // Then add the item itself
            filteredResult.push(item);
          }
        } else {
          // Pass through any other item types
          filteredResult.push(item);
        }
      }

      return filteredResult;
    }

    return result;
  }, [flattenedItems, debouncedSearchQuery, filters, favorites]);
};

/**
 * Generate skeleton items for loading state
 */
const useSkeletonItems = () => {
  return React.useMemo(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({ type: 'skeleton_header', id: `skeleton-header-${i}` });
      const itemCount = Math.floor(Math.random() * 6) + 3;
      for (let j = 0; j < itemCount; j++) {
        items.push({ type: 'skeleton_item', id: `skeleton-item-${i}-${j}` });
      }
    }
    return items;
  }, []);
};

const Location = () => {
  // Core state and data
  const { location } = useLocalSearchParams<{ location: string }>();
  const {
    data,
    loading,
    selectedMenu,
    setSelectedMenu,
    filters: menuFilters,
  } = useLocationData(location);
  const { toggleCategory, flattenedItems, resetExpandedCategories } = useCategoryExpansion(data);
  const db = useDatabase();

  const { data: favorites } = useLiveQuery(db.select().from(schema.favorites));

  // Get active filters from filters store
  const activeFilters = useFiltersStore((state) => state.filters);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Custom hooks for UI elements
  const filteredItems = useFilteredItems(
    flattenedItems,
    debouncedSearchQuery,
    activeFilters,
    favorites
  );
  const skeletonItems = useSkeletonItems();

  // Scroll to top functionality
  const listRef = useRef<FlashList<any>>(null);
  const { showScrollToTop, scrollButtonAnimation, handleScroll, scrollToTop } =
    useScrollToTop(listRef);

  // Reset search and expanded categories when menu changes
  useEffect(() => {
    setSearchQuery('');
    resetExpandedCategories();
  }, [selectedMenu, resetExpandedCategories]);

  // Determine which data to display
  const getDisplayedItems = useCallback(() => {
    if (loading) return skeletonItems;
    return debouncedSearchQuery ||
      Object.values(activeFilters).some(
        (val) => val === true || (typeof val === 'object' && Object.values(val).some((v) => v))
      )
      ? filteredItems
      : flattenedItems;
  }, [loading, debouncedSearchQuery, filteredItems, flattenedItems, skeletonItems, activeFilters]);

  // In your renderItem function in [location].tsx
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      switch (item.type) {
        case 'category_header':
          return (
            <View className="mt-4 px-6">
              <CategoryHeader
                title={item.title}
                isExpanded={item.isExpanded}
                onToggle={async () => {
                  toggleCategory(item.id);
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              />
            </View>
          );

        case 'food_item': {
          // Don't render if marked as hidden
          if (item.hidden) {
            return null;
          }

          return (
            <FoodItemRow
              item={item}
              selectedMenu={selectedMenu as string}
              location={location as string}
              db={db}
              favorites={favorites}
            />
          );
        }

        case 'skeleton_header':
          return <SkeletonItem isHeader />;

        case 'skeleton_item':
          return <SkeletonItem />;

        default:
          return null;
      }
    },
    [selectedMenu, location, toggleCategory, favorites, db]
  );

  // Empty state component
  const EmptyState = useCallback(() => {
    if (loading) return null;

    const subtitle = () => {
      if (debouncedSearchQuery) {
        return 'Try a different search term.';
      } else if (
        Object.values(activeFilters).some(
          (val) => val === true || (typeof val === 'object' && Object.values(val).some((v) => v))
        )
      ) {
        return 'Try adjusting your filters.';
      }

      return 'Please try again later.';
    };

    return (
      <View className="mt-12 flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-ut-burnt-orange">No items found.</Text>
        <Text className="text-sm">{subtitle()}</Text>
      </View>
    );
  }, [loading, debouncedSearchQuery, activeFilters]);

  return (
    <>
      <Stack.Screen options={{ title: 'Location' }} />
      <Container className="relative mx-0 w-full flex-1">
        <FlashList
          extraData={favorites}
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          estimatedItemSize={80}
          data={getDisplayedItems()}
          ListHeaderComponent={
            <LocationHeader
              location={location}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              filters={menuFilters}
              query={searchQuery}
              setQuery={(query) => {
                resetExpandedCategories();
                setSearchQuery(query);
              }}
            />
          }
          ListEmptyComponent={<EmptyState />}
          renderItem={renderItem}
          getItemType={(item) => ('type' in item ? item.type : 'unknown')}
          keyboardShouldPersistTaps="always"
        />

        <ScrollToTopButton
          visible={showScrollToTop}
          animationValue={scrollButtonAnimation}
          onPress={() => {
            scrollToTop();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      </Container>
    </>
  );
};

export default Location;
