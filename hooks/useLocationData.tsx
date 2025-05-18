import { useState, useEffect } from 'react';

import { useDatabase } from './useDatabase';

import { getLocationMenuNames, getLocationMenuData, Location } from '~/db/database';
import { LOCATION_INFO } from '~/data/LocationInfo';

export function useLocationData(location: string) {
  const db = useDatabase();

  const [data, setData] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ title: string; id: string }[]>([]);

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Check if the location is a coffee shop
        const locationInfo = LOCATION_INFO.find((loc) => loc.name === location);
        const isCoffeeShop = locationInfo?.type === 'Coffee Shop';

        // If it's a coffee shop, don't try to load menu data
        if (isCoffeeShop) {
          setData({
            location_name: location,
            menus: [],
          });
          setFilters([]);
          setLoading(false);
          return;
        }

        const menuNames = await getLocationMenuNames(db, location);
        const fetchedData = await getLocationMenuData(db, location, menuNames[0] as string);

        if (fetchedData === null) {
          throw new Error('No data found for location ' + location);
        }

        setFilters(menuNames.map((menuName) => ({ title: menuName || '', id: menuName || '' })));
        setData(fetchedData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setData(null);
        setFilters([]);
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [db, location]);

  // Handle menu changes
  useEffect(() => {
    if (!selectedMenu) return;

    // Check if the location is a coffee shop - skip fetching for coffee shops
    const locationInfo = LOCATION_INFO.find((loc) => loc.name === location);
    const isCoffeeShop = locationInfo?.type === 'Coffee Shop';
    if (isCoffeeShop) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getLocationMenuData(db, location, selectedMenu);
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchData();
  }, [selectedMenu, db, location]);

  return { data, loading, selectedMenu, setSelectedMenu, filters };
}
