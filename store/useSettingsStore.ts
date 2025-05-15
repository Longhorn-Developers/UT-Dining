import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

interface SettingsState {
  useColloquialNames: boolean;
  toggleColloquialNames: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      useColloquialNames: false,
      toggleColloquialNames: () => {
        set((state) => ({
          useColloquialNames: !state.useColloquialNames,
        }));
      },
      isDarkMode: false,
      toggleDarkMode: () => {
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        }));
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
