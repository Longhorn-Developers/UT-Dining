import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import CategoryHeader from './components/CategoryHeader';
import LocationHeader from './components/LocationHeader';
import ScrollToTopButton from './components/ScrollToTopButton';
import SkeletonItem from './components/SkeletonItem';
import { useCategoryExpansion } from '../../hooks/useCategoryExpansion';
import { useLocationData } from '../../hooks/useLocationData';

import { Container } from '~/components/Container';
import FoodComponent from '~/components/FoodComponent';
import { useDebounce } from '~/hooks/useDebounce';

const Location = () => {
  const { location } = useLocalSearchParams<{ location: string }>();
  const { data, loading, selectedMenu, setSelectedMenu, filters } = useLocationData(location);
  const { toggleCategory, flattenedItems, resetExpandedCategories } = useCategoryExpansion(data);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms debounce delay

  const listRef = useRef<FlashList<any>>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  // Animation value for fade and scale effect
  const scrollButtonAnimation = useRef(new Animated.Value(0)).current;

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return flattenedItems;
    }

    const query = searchQuery.toLowerCase();
    const result = [];
    let currentCategory = null;
    let hasMatch = false;

    for (const item of flattenedItems) {
      if (item.type === 'category_header') {
        currentCategory = { ...item, isExpanded: true };
        hasMatch = false;
        // Don't add category yet, wait to see if it has matching items
      } else if (item.type === 'food_item') {
        const foodName = item.data.name ? item.data.name.toLowerCase() : '';

        if (foodName.includes(query)) {
          // If this is the first match in this category, add the category header first
          if (!hasMatch && currentCategory) {
            result.push(currentCategory);
            hasMatch = true;
          }
          // Then add the matching food item
          result.push(item);
        }
      }
    }

    return result;
  }, [flattenedItems, debouncedSearchQuery]);

  // Handle scroll events to show/hide button with animation
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    // Show button when scrolled down at least 400 pixels
    if (scrollPosition > 500 && !showScrollToTop) {
      setShowScrollToTop(true);
      Animated.spring(scrollButtonAnimation, {
        toValue: 1,
        useNativeDriver: true,
        // Add spring configuration for a bouncy effect
        friction: 7,
        tension: 40,
      }).start();
    } else if (scrollPosition <= 500 && showScrollToTop) {
      Animated.spring(scrollButtonAnimation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
      }).start(() => {
        // Only hide the button after animation completes
        setShowScrollToTop(false);
      });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Reset search when menu changes
  useEffect(() => {
    setSearchQuery('');
  }, [selectedMenu]);

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

  // Reset expanded categories when selectedMenu changes
  useEffect(() => {
    resetExpandedCategories();
  }, [selectedMenu, resetExpandedCategories]);

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

  // Helper function to determine which data to display
  const getDisplayedItems = () => {
    if (loading) {
      return skeletonItems;
    }

    return debouncedSearchQuery ? filteredItems : flattenedItems;
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Location' }} />
      <Container className="relative mx-0 w-full flex-1">
        <FlashList
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          estimatedItemSize={80}
          data={getDisplayedItems()}
          ListHeaderComponent={
            <>
              <LocationHeader
                location={location}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                filters={filters}
                query={searchQuery}
                setQuery={setSearchQuery}
              />
            </>
          }
          ListEmptyComponent={
            loading ? null : (
              <View className="mt-12 flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-ut-burnt-orange">No items found.</Text>
                <Text className="text-sm">
                  {debouncedSearchQuery
                    ? 'Try a different search term.'
                    : 'Please try again later.'}
                </Text>
              </View>
            )
          }
          renderItem={renderItem}
          getItemType={(item) => ('type' in item ? item.type : 'unknown')}
        />

        <ScrollToTopButton
          visible={showScrollToTop}
          animationValue={scrollButtonAnimation}
          onPress={scrollToTop}
        />
      </Container>
    </>
  );
};

export default Location;
