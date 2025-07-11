import { FlashList } from '@shopify/flash-list';
import { eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, Stack, useFocusEffect } from 'expo-router';
import { Bell, ChefHat, MapPin, Star, ExternalLink } from 'lucide-react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';

import { Container } from '~/components/Container';
import { useDatabase } from '~/hooks/useDatabase';
import * as schema from '~/services/database/schema';
import { useNotificationsStore } from '~/store/useNotificationsStore';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

export interface Notification {
  id: string;
  title: string | null;
  body: string | null;
  redirect_url: string | null;
  type: string | null;
  sent_at: string | null;
  type_name: string;
  // UI state
  isRead: boolean;
}

const NotificationItem = ({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: (notification: Notification) => void;
}) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  // Refer to the Supabase notification_types table for the type names
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Food Alert':
        return <ChefHat size={20} color={COLORS['ut-burnt-orange']} />;
      case 'Location Update':
        return <MapPin size={20} color={COLORS['ut-burnt-orange']} />;
      case 'Special Alert':
        return <Star size={20} color={COLORS['ut-burnt-orange']} />;
      case 'System Announcement':
        return <Bell size={20} color={COLORS['ut-burnt-orange']} />;
      default:
        return <Bell size={20} color={COLORS['ut-burnt-orange']} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={notification.redirect_url ? 0.5 : 1}
      onPress={() => onPress(notification)}
      className={cn(
        'mx-6 rounded-lg p-4',
        notification.isRead
          ? isDarkMode
            ? 'bg-gray-800'
            : 'bg-gray-50'
          : isDarkMode
            ? 'bg-orange-500/5'
            : 'bg-orange-50'
      )}>
      <View className="flex-row items-start gap-x-3">
        <View className="mt-1">{getNotificationIcon(notification.type_name)}</View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-black')}>
              {notification.title}
            </Text>
            <View className="flex-row items-center gap-x-2">
              {notification.redirect_url && (
                <ExternalLink size={14} color={COLORS['ut-burnt-orange']} />
              )}
              <Text className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
                {notification.sent_at && formatTimestamp(notification.sent_at)}
              </Text>
            </View>
          </View>

          <Text
            className={cn(
              'mt-1 text-sm leading-relaxed',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
            {notification.body}
          </Text>

          {!notification.isRead && (
            <View className="mt-2 flex-row">
              <View className="rounded-full bg-ut-burnt-orange px-2 py-1">
                <Text className="text-xs font-bold text-white">NEW</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const [refreshing, setRefreshing] = useState(false);
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const db = useDatabase();
  const { lastVisited, setLastVisited } = useNotificationsStore();

  // Track when user leaves the notifications page
  useFocusEffect(
    useCallback(() => {
      return () => {
        // This cleanup function runs when the screen loses focus
        const now = Date.now();
        setLastVisited(now);
      };
    }, [setLastVisited])
  );

  // Use live query to get notifications in real-time, sorted by sent_at DESC
  const { data: dbNotifications = [] } = useLiveQuery(
    db
      ?.select({
        id: schema.notifications.id,
        title: schema.notifications.title,
        body: schema.notifications.body,
        redirect_url: schema.notifications.redirect_url,
        type: schema.notifications.type,
        sent_at: schema.notifications.sent_at,
        type_name: schema.notification_types.name,
      })
      .from(schema.notifications)
      .leftJoin(
        schema.notification_types,
        eq(schema.notifications.type, schema.notification_types.id)
      )
      .orderBy(sql`datetime(${schema.notifications.sent_at}) DESC`)
  );

  // Convert database notifications to UI format with isRead state
  const notifications: Notification[] = useMemo(() => {
    return (dbNotifications || []).map((notification) => {
      const isRead =
        lastVisited !== null &&
        notification.sent_at !== null &&
        new Date(notification.sent_at).getTime() <= lastVisited;

      return {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        redirect_url: notification.redirect_url,
        type: notification.type,
        sent_at: notification.sent_at,
        type_name: notification.type_name || 'system_announcement',
        isRead,
      };
    });
  }, [dbNotifications, lastVisited]);

  const handleNotificationPress = (notification: Notification) => {
    if (notification.redirect_url) {
      router.push(notification.redirect_url as any);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // The live query will automatically refresh the data
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleReadAll = () => {
    const now = Date.now();
    setLastVisited(now);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerShown: false,
        }}
      />
      <Container className="mx-0" disableBottomPadding>
        <FlashList
          ListHeaderComponent={
            <View className="mt-6 flex gap-y-5 px-6">
              <View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-x-2">
                    <Text
                      className={cn(
                        'text-3xl font-extrabold',
                        isDarkMode ? 'text-white' : 'text-black'
                      )}>
                      Notifications
                    </Text>
                  </View>
                  {unreadCount > 0 && (
                    <View className="flex-row items-center gap-x-3">
                      <TouchableOpacity
                        onPress={handleReadAll}
                        className="rounded-lg bg-ut-burnt-orange px-3 py-1">
                        <Text className="text-xs font-semibold text-white">Read All</Text>
                      </TouchableOpacity>
                      <View className="rounded-full bg-ut-burnt-orange px-3 py-1">
                        <Text className="text-sm font-bold text-white">{unreadCount}</Text>
                      </View>
                    </View>
                  )}
                </View>
                <Text className={cn('font-medium', isDarkMode ? 'text-gray-300' : 'text-ut-grey')}>
                  Stay updated with the latest dining alerts and updates.
                </Text>
              </View>

              <View
                className={cn(
                  'my-1 mb-6 w-full border-b',
                  isDarkMode ? 'border-gray-700' : 'border-ut-grey/15'
                )}
              />
            </View>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          estimatedItemSize={120}
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem notification={item} onPress={handleNotificationPress} />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS['ut-burnt-orange']}
            />
          }
          ListEmptyComponent={
            <View className="mt-12 flex items-center justify-center px-6">
              <Text className="mt-4 text-lg font-bold text-ut-burnt-orange">
                No Notifications Yet!
              </Text>
              <Text
                className={cn(
                  'mt-2 max-w-72 text-center',
                  isDarkMode ? 'text-gray-300' : 'text-ut-grey'
                )}>
                We'll notify you about your favorite foods and dining location updates.
              </Text>
            </View>
          }
        />
      </Container>
    </View>
  );
};

export default Notifications;
