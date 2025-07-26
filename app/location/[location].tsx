import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Container } from '~/components/Container';
import type { ListItem } from '~/hooks/useCategoryExpansion';
import { useCategoryExpansion } from '~/hooks/useCategoryExpansion';
import { useDatabase } from '~/hooks/useDatabase';
import { useDebounce } from '~/hooks/useDebounce';
import { useMenuData } from '~/hooks/useMenuData';
import { useScrollToTop } from '~/hooks/useScrollToTop';
import * as schema from '~/services/database/schema';
import { type FiltersState, useFiltersStore } from '~/store/useFiltersStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { getTodayInCentralTime } from '~/utils/date';
import { filterFoodItems } from '~/utils/filter';
import { cn } from '~/utils/utils';
import CategoryHeader from './components/CategoryHeader';
import FoodItemRow from './components/FoodItemRow';
import LocationHeader from './components/LocationHeader';
import ScrollToTopButton from './components/ScrollToTopButton';
import SkeletonItem from './components/SkeletonItem';

/**
 * Filter items based on search query and user-selected filters
 */
const useFilteredItems = (
  flattenedItems: ListItem[],
  debouncedSearchQuery: string,
  filters: FiltersState['filters'],
  favorites: schema.Favorite[],
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

          if (foodName.includes(query)) {
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
          (typeof val === 'object' && val !== null && Object.values(val).some((v) => v)),
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
const useSkeletonItems = (): ListItem[] => {
  return React.useMemo(() => {
    const items: ListItem[] = [];
    for (let i = 0; i < 2; i++) {
      items.push({ type: 'skeleton_header', id: `skeleton-header-${i}` } as const);
      const itemCount = Math.floor(Math.random() * 2) + 3;
      for (let j = 0; j < itemCount; j++) {
        items.push({ type: 'skeleton_item', id: `skeleton-item-${i}-${j}` } as const);
      }
    }
    return items;
  }, []);
};

const Location = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  // Core state and data
  const { location } = useLocalSearchParams<{ location: string }>();
  const [selectedDate, setSelectedDate] = useState(getTodayInCentralTime());
  const {
    menuData: data,
    loading,
    error,
    selectedMenu,
    setSelectedMenu,
    filters: menuFilters,
    isSwitchingMenus,
  } = useMenuData(location, selectedDate);
  const { toggleCategory, flattenedItems, resetExpandedCategories } = useCategoryExpansion(data);
  const db = useDatabase();

  const posthog = usePostHog();

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
    favorites,
  );
  const skeletonItems = useSkeletonItems();

  // Scroll to top functionality
  const listRef = useRef<FlashList<ListItem>>(null);
  const { showScrollToTop, scrollButtonAnimation, handleScroll, scrollToTop } =
    useScrollToTop(listRef);

  // Date change handler
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Reset search and expanded categories when menu or date changes
  useEffect(() => {
    try {
      setSearchQuery('');
      if (resetExpandedCategories) {
        resetExpandedCategories();
      }
    } catch (error) {
      console.error('Error resetting menu state:', error);
    }
  }, [resetExpandedCategories]);

  useEffect(() => {
    if (posthog) {
      posthog.screen(location);
    }
  }, [location, posthog]);

  // Memoize the displayed items to prevent unnecessary recalculations
  const displayedItems = useMemo(() => {
    if (loading) return skeletonItems;
    if (error) return []; // Return empty array on error, EmptyState will handle the display
    return debouncedSearchQuery ||
      Object.values(activeFilters).some(
        (val) => val === true || (typeof val === 'object' && Object.values(val).some((v) => v)),
      )
      ? filteredItems
      : flattenedItems;
  }, [
    loading,
    error,
    debouncedSearchQuery,
    filteredItems,
    flattenedItems,
    skeletonItems,
    activeFilters,
  ]);

  // In your renderItem function in [location].tsx
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
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
              selectedMenu={selectedMenu ?? ''}
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
    [selectedMenu, location, toggleCategory, favorites, db],
  );

  // Empty state component
  const EmptyState = useCallback(() => {
    if (loading) return null;

    const subtitle = () => {
      if (error) {
        return 'There was an error loading the menu. Please try again.';
      } else if (debouncedSearchQuery) {
        return 'Try a different search term.';
      } else if (
        Object.values(activeFilters).some(
          (val) => val === true || (typeof val === 'object' && Object.values(val).some((v) => v)),
        )
      ) {
        return 'Try adjusting your filters.';
      }

      return 'Please try again later.';
    };

    const title = error ? 'Error Loading Menu' : 'No items found.';

    return (
      <View className="mt-12 flex-1 items-center justify-center">
        <Text className="font-bold text-ut-burnt-orange text-xl">{title}</Text>
        <Text className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-600')}>
          {subtitle()}
        </Text>
      </View>
    );
  }, [loading, error, debouncedSearchQuery, activeFilters, isDarkMode]);

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      <Stack.Screen options={{ title: 'Location' }} />
      <Container className="relative mx-0 w-full flex-1">
        <FlashList
          estimatedItemSize={60}
          extraData={favorites}
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          data={displayedItems}
          removeClippedSubviews
          scrollEnabled={!isSwitchingMenus}
          ListHeaderComponent=<LocationHeader
            location={location}
            selectedMenu={selectedMenu ?? null}
            setSelectedMenu={setSelectedMenu}
            filters={menuFilters}
            query={searchQuery}
            setQuery={(query) => {
              resetExpandedCategories();
              setSearchQuery(query);
            }}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
          ListEmptyComponent={<EmptyState />}
          renderItem={renderItem}
          getItemType={(item) => ('type' in item ? item.type : 'unknown')}
          keyboardShouldPersistTaps="always"
        />

        {/* Loading indicator for menu switching */}
        {isSwitchingMenus && (
          <View
            className="absolute inset-0 z-10 flex h-screen items-center justify-center"
            style={{
              backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <View
              className="flex items-center justify-center rounded-lg p-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <ActivityIndicator size="small" style={{ marginBottom: 8 }} />
            </View>
          </View>
        )}

        <ScrollToTopButton
          visible={showScrollToTop}
          animationValue={scrollButtonAnimation}
          onPress={() => {
            scrollToTop();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      </Container>
    </View>
  );
};

export default Location;
