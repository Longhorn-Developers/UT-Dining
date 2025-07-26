import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

interface AppLaunchState {
  // Launch tracking
  launchCount: number;
  firstLaunchTimestamp: number | null;
  hasShownRatingPrompt: boolean;

  // Actions
  incrementLaunchCount: () => void;
  markRatingPromptShown: () => void;
  resetRatingPrompt: () => void;

  // Helpers
  shouldShowRatingPrompt: () => boolean;
  isSecondLaunch: () => boolean;
}

export const useAppLaunchStore = create<AppLaunchState>()(
  persist(
    (set, get) => ({
      launchCount: 0,
      firstLaunchTimestamp: null,
      hasShownRatingPrompt: false,

      incrementLaunchCount: () => {
        const state = get();
        set({
          launchCount: state.launchCount + 1,
          firstLaunchTimestamp: state.firstLaunchTimestamp ?? Date.now(),
        });
      },

      markRatingPromptShown: () => {
        set({ hasShownRatingPrompt: true });
      },

      resetRatingPrompt: () => {
        set({
          launchCount: 0,
          firstLaunchTimestamp: null,
          hasShownRatingPrompt: false,
        });
      },

      shouldShowRatingPrompt: () => {
        const state = get();
        return state.launchCount >= 2 && !state.hasShownRatingPrompt;
      },

      isSecondLaunch: () => {
        return get().launchCount === 2;
      },
    }),
    {
      name: 'app-launch-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
