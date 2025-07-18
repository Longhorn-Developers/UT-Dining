import { sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useEffect, useMemo } from 'react';

import { useDatabase } from '~/hooks/useDatabase';
import * as schema from '~/services/database/schema';
import { useNotificationsStore } from '~/store/useNotificationsStore';

export function useUnreadNotifications() {
  const db = useDatabase();
  const { lastVisited, initializeLastVisited } = useNotificationsStore();

  // Initialize last visited timestamp on mount
  useEffect(() => {
    initializeLastVisited();
  }, [initializeLastVisited]);

  // Get notifications from database
  const { data: dbNotifications = [] } = useLiveQuery(
    db
      ?.select({
        id: schema.notifications.id,
        sent_at: schema.notifications.sent_at,
      })
      .from(schema.notifications)
      .orderBy(sql`datetime(${schema.notifications.sent_at}) DESC`),
  );

  // Calculate unread count based on last visited timestamp
  const unreadCount = useMemo(() => {
    if (lastVisited === null) {
      // If never visited, all notifications are unread
      return dbNotifications.length;
    }

    return dbNotifications.filter((notification) => {
      if (!notification.sent_at) return false;
      const sentTime = new Date(notification.sent_at).getTime();
      return sentTime > lastVisited;
    }).length;
  }, [dbNotifications, lastVisited]);

  return {
    unreadCount,
    hasUnread: unreadCount > 0,
  };
}
