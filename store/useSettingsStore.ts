import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

interface SettingsState {
  useColloquialNames: boolean;
  toggleColloquialNames: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDarkMode: boolean) => void;
}

// Get the initial color scheme from device
const devicePrefersDarkMode = Appearance.getColorScheme() === 'dark';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      useColloquialNames: false,
      toggleColloquialNames: () => {
        set((state) => ({
          useColloquialNames: !state.useColloquialNames,
        }));
      },
      isDarkMode: devicePrefersDarkMode,
      toggleDarkMode: () => {
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        }));
      },
      setDarkMode: (isDarkMode) => {
        set({ isDarkMode });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

// Listen for changes in the system color scheme
Appearance.addChangeListener(({ colorScheme }) => {
  const currentStore = useSettingsStore.getState();
  if (currentStore.isDarkMode === (colorScheme === 'dark')) return;
  currentStore.setDarkMode(colorScheme === 'dark');
});
