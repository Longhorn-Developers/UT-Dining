import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getLocationMenuData,
  getLocationMenuNames,
  type Location,
} from '~/services/database/database';
import { getTodayInCentralTime } from '~/utils/date';
import { getMealTimes } from '~/utils/locations';
import { timeOfDay } from '~/utils/time';
import { useDatabase } from './useDatabase';

// Define the proper meal order
const MEAL_ORDER = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
};

export function useMenuData(location: string, date?: string) {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [isMenuSwitching, setIsMenuSwitching] = useState(false);
  const prevSelectedMenuRef = useRef<string | null>(null);

  // Use provided date or default to today
  const targetDate = date || getTodayInCentralTime();

  // Query for menu names
  const {
    data: menuNames = [],
    isLoading: isLoadingMenuNames,
    error: menuNamesError,
  } = useQuery({
    queryKey: ['menuNames', location, targetDate],
    queryFn: () => getLocationMenuNames(db, location, targetDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!location,
  });

  // Smart menu selection logic
  const defaultMenu = useMemo(() => {
    // If user has manually selected a menu, use that
    if (selectedMenu) return selectedMenu;

    // If no menus available, return null
    if (menuNames.length === 0) return null;

    // If there's only one menu, automatically select it
    if (menuNames.length === 1) {
      return menuNames[0];
    }

    // Use time-of-day logic to determine appropriate menu
    const mealTimes = getMealTimes(db, location);
    const tod = mealTimes ? timeOfDay(new Date(), mealTimes) : timeOfDay(new Date());
    let targetMenu = '';

    if (tod === 'morning') targetMenu = 'Breakfast';
    else if (tod === 'afternoon') targetMenu = 'Lunch';
    else if (tod === 'evening') targetMenu = 'Dinner';

    // Find menu with matching title
    const matchingMenu = menuNames.find((menuName) => menuName === targetMenu);

    if (matchingMenu) {
      return matchingMenu;
    } else {
      // Sort menus by meal order and fallback to first available
      const sortedMenus = [...menuNames].sort((a, b) => {
        const orderA = MEAL_ORDER[a as keyof typeof MEAL_ORDER] || 999;
        const orderB = MEAL_ORDER[b as keyof typeof MEAL_ORDER] || 999;
        return orderA - orderB;
      });
      return sortedMenus[0];
    }
  }, [selectedMenu, menuNames, location, db]);

  // Prefetch all menu data for instant switching
  useEffect(() => {
    if (menuNames.length > 0 && queryClient) {
      menuNames.forEach((menuName) => {
        if (menuName) {
          queryClient.prefetchQuery({
            queryKey: ['menuData', location, menuName, targetDate],
            queryFn: () => getLocationMenuData(db, location, menuName, targetDate),
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        }
      });
    }
  }, [menuNames, location, db, queryClient, targetDate]);

  // Query for current menu data (should be instant due to prefetching)
  const {
    data: menuData = null,
    isLoading: isLoadingMenuData,
    error: menuDataError,
  } = useQuery({
    queryKey: ['menuData', location, defaultMenu, targetDate],
    queryFn: () => getLocationMenuData(db, location, defaultMenu as string, targetDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!location && !!defaultMenu,
  });

  // Track menu switching state
  useEffect(() => {
    if (defaultMenu && prevSelectedMenuRef.current !== defaultMenu) {
      if (prevSelectedMenuRef.current !== null) {
        setIsMenuSwitching(true);
      }
      prevSelectedMenuRef.current = defaultMenu;
    }
  }, [defaultMenu]);

  // Reset switching state when data is loaded
  useEffect(() => {
    if (!isLoadingMenuData && isMenuSwitching) {
      const timer = setTimeout(() => {
        setIsMenuSwitching(false);
      }, 200); // Small delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [isLoadingMenuData, isMenuSwitching]);

  // Transform menu names to filters format
  const filters = useMemo(
    () =>
      menuNames.map((menuName) => ({
        title: menuName || '',
        id: menuName || '',
      })),
    [menuNames],
  );

  const loading = isLoadingMenuNames || isLoadingMenuData;
  const error = menuNamesError || menuDataError;

  return {
    menuData: menuData as Location | null,
    loading,
    error,
    selectedMenu: defaultMenu,
    setSelectedMenu,
    filters,
    isSwitchingMenus: isMenuSwitching,
  };
}
