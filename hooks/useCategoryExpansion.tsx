import { useCallback, useMemo, useState } from 'react';

import type { FoodItem, Location } from '~/services/database/database';

// Add a new flag to mark hidden items
export type ListItem =
  | { type: 'category_header'; id: string; title: string; isExpanded: boolean }
  | { type: 'food_item'; id: string; categoryId: string; data: FoodItem; hidden?: boolean }
  | { type: 'skeleton_header'; id: string }
  | { type: 'skeleton_item'; id: string };

export function useCategoryExpansion(data: Location | null) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Toggle category expansion
  const toggleCategory = useCallback(
    (categoryId: string) => {
      try {
        // On first toggle, set category to not expanded
        if (expandedCategories[categoryId] === undefined) {
          // If category is not in the list, set it to expanded
          setExpandedCategories((prev) => ({ ...prev, [categoryId]: false }));
          return;
        }

        setExpandedCategories((prev) => ({
          ...prev,
          [categoryId]: !prev[categoryId],
        }));
      } catch (error) {
        console.error('Error toggling category:', error);
      }
    },
    [expandedCategories],
  );

  // Convert hierarchical data to flat list items with optimized memoization
  const flattenedItems = useMemo(() => {
    if (!data?.menus?.length) return [];

    const items: ListItem[] = [];
    const menu = data.menus[0];

    // Use a stable reference for menu categories to avoid unnecessary recalculations
    const categories = menu.menu_categories;

    categories.forEach((category) => {
      // Generate unique ID for the category
      const categoryId = `${category.category_title}`;

      // Default to expanded unless explicitly set to false
      const isExpanded = expandedCategories[categoryId] !== false;

      // Add category header
      items.push({
        type: 'category_header',
        id: categoryId,
        title: category.category_title as string,
        isExpanded,
      });

      // Always add food items, but mark them as hidden if category is collapsed
      category.food_items.forEach((food, index) => {
        items.push({
          type: 'food_item',
          id: `${categoryId}-${food.name}-${index}`,
          categoryId,
          data: food,
          hidden: !isExpanded, // Mark as hidden if category is not expanded
        });
      });
    });

    return items;
  }, [data?.menus, expandedCategories]);

  const resetExpandedCategories = useCallback(() => {
    try {
      // Reset to empty object which will result in all categories being expanded again
      setExpandedCategories({});
    } catch (error) {
      console.error('Error resetting expanded categories:', error);
    }
  }, []);

  return { expandedCategories, toggleCategory, flattenedItems, resetExpandedCategories };
}
