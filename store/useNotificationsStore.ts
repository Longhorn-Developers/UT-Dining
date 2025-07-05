import { create } from 'zustand';

import { notificationsStorage } from './notifications-storage';

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
