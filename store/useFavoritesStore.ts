import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './rnmmkv-storage';

export interface FavoriteItem {
  name: string;
  locationName: string;
  categoryName: string;
  menuName: string;
  dateAdded: string;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  initialized: boolean;
  addFavorite: (item: Omit<FavoriteItem, 'dateAdded'>) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
  toggleFavoriteItem: (item: Omit<FavoriteItem, 'dateAdded'>) => void;
  clearFavorites: () => void;
}

/**
 * Zustand store for managing favorite food items.
 * Persists favorites in RNMMKV storage.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      initialized: false,

      // Add a food item to favorites
      addFavorite: (item) => {
        set((state) => {
          // Check if already in favorites to prevent duplicates
          const isDuplicate = state.favorites.some(
            (fav) => fav.name === item.name && fav.locationName === item.locationName
          );

          if (isDuplicate) {
            return state;
          }

          return {
            favorites: [
              ...state.favorites,
              {
                ...item,
                dateAdded: new Date().toISOString(),
              },
            ],
          };
        });
      },

      // Remove a food item from favorites
      removeFavorite: (name) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.name !== name),
        }));
      },

      // Check if an item is in favorites
      isFavorite: (name) => {
        const { favorites } = get();
        return favorites.some((item) => item.name === name);
      },

      toggleFavoriteItem: (item) => {
        const isFavorite = get().isFavorite(item.name);

        if (isFavorite) {
          get().removeFavorite(item.name);
        } else {
          get().addFavorite({
            ...item,
          });
        }
      },

      // Clear all favorites
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = true;
        }
      },
    }
  )
);
