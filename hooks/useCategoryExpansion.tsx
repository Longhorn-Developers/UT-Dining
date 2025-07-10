import { useState, useCallback, useMemo } from 'react';

import { FoodItem, Location } from '~/services/database/database';

// Add a new flag to mark hidden items
export type ListItem =
  | { type: 'category_header'; id: string; title: string; isExpanded: boolean }
  | { type: 'food_item'; id: string; categoryId: string; data: FoodItem; hidden?: boolean }
  | { type: 'skeleton_header'; id: string }
  | { type: 'skeleton_item'; id: string };

export function useCategoryExpansion(data: Location | null) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
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
  };

  // Convert hierarchical data to flat list items
  const flattenedItems = useMemo(() => {
    if (!data?.menus?.length) return [];

    const items: ListItem[] = [];
    const menu = data.menus[0];

    menu.menu_categories.forEach((category) => {
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
  }, [data, expandedCategories]);

  const resetExpandedCategories = useCallback(() => {
    // Reset to empty object which will result in all categories being expanded again
    setExpandedCategories({});
  }, []);

  return { expandedCategories, toggleCategory, flattenedItems, resetExpandedCategories };
}
