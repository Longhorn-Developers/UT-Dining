import { create } from 'zustand';

import { miscStorage } from './misc-storage';

const NOTIFICATIONS_LAST_VISITED_KEY = 'notifications-last-visited';

const notificationsStorage = {
  setLastVisited: (timestamp: number) => {
    miscStorage.set(NOTIFICATIONS_LAST_VISITED_KEY, timestamp);
  },

  getLastVisited: (): number | null => {
    const timestamp = miscStorage.getNumber(NOTIFICATIONS_LAST_VISITED_KEY);
    return timestamp ?? null;
  },

  clearLastVisited: () => {
    miscStorage.delete(NOTIFICATIONS_LAST_VISITED_KEY);
  },
};

interface NotificationsState {
  lastVisited: number | null;
  setLastVisited: (timestamp: number) => void;
  initializeLastVisited: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  lastVisited: null,

  setLastVisited: (timestamp: number) => {
    notificationsStorage.setLastVisited(timestamp);
    set({ lastVisited: timestamp });
  },

  initializeLastVisited: () => {
    const stored = notificationsStorage.getLastVisited();
    set({ lastVisited: stored });
  },
}));
