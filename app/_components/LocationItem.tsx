import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';

import { LocationWithType, menu } from '~/db/schema';
import { useDatabase } from '~/hooks/useDatabase';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useSettingsStore } from '~/store/useSettingsStore';
import { getColor } from '~/utils/colors';
import { useLocationName } from '~/utils/locations';
import { getLocationTimeMessage, isLocationOpen } from '~/utils/time';
import { cn } from '~/utils/utils';

type LocationItemProps = {
  location: LocationWithType;
  currentTime: Date;
};

const LocationItem = ({ location, currentTime }: LocationItemProps) => {
  const [open, setOpen] = useState(false);
  const pingAnimation = useRef(new Animated.Value(0)).current;
  const db = useDatabase();
  const { useColloquialNames, isDarkMode, isColorBlindMode } = useSettingsStore();
  const { locationData } = useLocationDetails(location.name ?? '');
  const displayName = useLocationName(location.name ?? '', useColloquialNames);

  useEffect(() => {
    const checkOpen = async () => {
      const res = db.select().from(menu).where(eq(menu.location_id, location.id)).get();
      if (!res) {
        setOpen(false);
        return;
      }

      const isOpen = isLocationOpen(locationData, currentTime);
      setOpen(isOpen);
    };

    checkOpen();
  }, [currentTime, locationData]);

  useEffect(() => {
    // Stop any running animation
    pingAnimation.stopAnimation();
    pingAnimation.setValue(0);

    if (open) {
      startPingAnimation();
    }

    return () => {
      // Clean up animation on unmount
      pingAnimation.stopAnimation();
    };
  }, [open]);

  const startPingAnimation = () => {
    // Create a looping animation that expands and fades
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          delay: 2000,
        }),
        Animated.timing(pingAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        if (locationData?.has_menus) {
          router.push(`/location/${location.name}`);
        } else {
          router.push(`/location_generic/${location.name}`);
        }
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
      className={cn(
        'mb-2 flex-row items-center justify-between rounded p-4',
        isDarkMode ? 'border border-gray-700 bg-gray-800' : 'border border-ut-grey/15 bg-white'
      )}>
      <View className="flex-row items-center justify-center gap-x-4">
        <View className="relative size-3">
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 9999,
              backgroundColor: open
                ? getColor('status-open', isColorBlindMode)
                : getColor('status-closed', isColorBlindMode),
              shadowColor: open
                ? getColor('status-open', isColorBlindMode)
                : getColor('status-closed', isColorBlindMode),
              shadowOpacity: 0.5,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          />

          {open && (
            <Animated.View
              style={{
                position: 'absolute',
                width: 12,
                height: 12,
                borderRadius: 12,
                backgroundColor: isColorBlindMode
                  ? 'rgba(0, 90, 181, 0.75)'
                  : 'rgba(34, 197, 94, 0.75)',
                transform: [
                  {
                    scale: pingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.25, 2.5],
                    }),
                  },
                ],
                opacity: pingAnimation.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [0.8, 0.4, 0],
                }),
                top: -1,
                left: -1,
              }}
            />
          )}
        </View>
        <View>
          <Text
            className={cn(
              'text-xl font-bold',
              open
                ? isDarkMode
                  ? 'text-white'
                  : 'text-ut-black'
                : isDarkMode
                  ? 'text-gray-500'
                  : 'text-ut-grey/75'
            )}>
            {displayName}
          </Text>
          <Text
            className={cn('text-xs font-medium', isDarkMode ? 'text-gray-400' : 'text-ut-grey/75')}>
            {open ? getLocationTimeMessage(locationData, currentTime) : 'Closed'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-x-3">
        <ChevronRight
          color={isDarkMode ? '#fff' : getColor('ut-burnt-orange', isColorBlindMode)}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
};

export default LocationItem;
