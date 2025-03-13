import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

import * as schema from '../db/schema';

/**
 * Custom hook for accessing the drizzle database instance
 * @returns The initialized drizzle database instance
 */
export function useDatabase(): ExpoSQLiteDatabase<typeof schema> {
  const db = useSQLiteContext();
  return useMemo(() => drizzle(db, { schema }), [db]);
}
