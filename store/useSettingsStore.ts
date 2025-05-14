import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

interface SettingsState {
  useColloquialNames: boolean;
  toggleColloquialNames: () => void;
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
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
