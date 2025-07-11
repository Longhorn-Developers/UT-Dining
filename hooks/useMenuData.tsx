import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useRef } from 'react';

import { useDatabase } from './useDatabase';

import { getLocationMenuNames, getLocationMenuData, Location } from '~/services/database/database';

export function useMenuData(location: string) {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [isMenuSwitching, setIsMenuSwitching] = useState(false);
  const prevSelectedMenuRef = useRef<string | null>(null);

  // Query for menu names
  const {
    data: menuNames = [],
    isLoading: isLoadingMenuNames,
    error: menuNamesError,
  } = useQuery({
    queryKey: ['menuNames', location],
    queryFn: () => getLocationMenuNames(db, location),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!location,
  });

  // Auto-select first menu if none selected
  const defaultMenu = selectedMenu || menuNames[0];

  // Prefetch all menu data for instant switching
  useEffect(() => {
    if (menuNames.length > 0 && queryClient) {
      menuNames.forEach((menuName) => {
        if (menuName) {
          queryClient.prefetchQuery({
            queryKey: ['menuData', location, menuName],
            queryFn: () => getLocationMenuData(db, location, menuName),
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        }
      });
    }
  }, [menuNames, location, db, queryClient]);

  // Query for current menu data (should be instant due to prefetching)
  const {
    data: menuData = null,
    isLoading: isLoadingMenuData,
    error: menuDataError,
  } = useQuery({
    queryKey: ['menuData', location, defaultMenu],
    queryFn: () => getLocationMenuData(db, location, defaultMenu as string),
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
    [menuNames]
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
