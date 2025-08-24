import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

interface DataSyncState {
  lastSupabaseQueryTime: number | null;
  setLastSupabaseQueryTime: (timestamp: number) => void;
  shouldSyncWithSupabase: () => boolean;
  getTimeSinceLastSync: () => number;
}

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export const useDataSyncStore = create<DataSyncState>()(
  persist(
    (set, get) => ({
      lastSupabaseQueryTime: null,

      setLastSupabaseQueryTime: (timestamp: number) => {
        set({ lastSupabaseQueryTime: timestamp });
      },

      shouldSyncWithSupabase: () => {
        const { lastSupabaseQueryTime } = get();

        // If never synced before, should sync
        if (lastSupabaseQueryTime === null) {
          return true;
        }

        const now = Date.now();
        const timeSinceLastSync = now - lastSupabaseQueryTime;

        // Should sync if more than 6 hours have passed
        return timeSinceLastSync >= SIX_HOURS_IN_MS;
      },

      getTimeSinceLastSync: () => {
        const { lastSupabaseQueryTime } = get();

        if (lastSupabaseQueryTime === null) {
          return Infinity; // Never synced
        }

        return Date.now() - lastSupabaseQueryTime;
      },
    }),
    {
      name: 'data-sync-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
