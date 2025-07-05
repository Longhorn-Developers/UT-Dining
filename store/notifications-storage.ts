import { miscStorage } from './misc-storage';

const NOTIFICATIONS_LAST_VISITED_KEY = 'notifications-last-visited';

export const notificationsStorage = {
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
