import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useEffect, useMemo } from 'react';

import * as schema from '../db/schema';

import { getLocationMenuNames, getLocationMenuData, StructuredLocation } from '~/db/database';

export function useLocationData(location: string) {
  const db = useSQLiteContext();
  const drizzleDb = useMemo(() => drizzle(db, { schema }), [db]);

  const [data, setData] = useState<StructuredLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ title: string; id: string }[]>([]);

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const menuNames = await getLocationMenuNames(drizzleDb, location);
        const fetchedData = await getLocationMenuData(drizzleDb, location, menuNames[0] as string);

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
  }, [drizzleDb, location]);

  // Handle menu changes
  useEffect(() => {
    if (!selectedMenu) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getLocationMenuData(drizzleDb, location, selectedMenu);
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchData();
  }, [selectedMenu, drizzleDb, location]);

  return { data, loading, selectedMenu, setSelectedMenu, filters };
}
