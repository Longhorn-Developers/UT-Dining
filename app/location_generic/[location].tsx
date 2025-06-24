import { Stack, useLocalSearchParams } from 'expo-router';
import { Clock, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Container } from '~/components/Container';
import { PAYMENT_INFO_ICONS } from '~/data/PaymentInfo';
import { useDatabase } from '~/hooks/useDatabase';
import { useLocationDetails } from '~/hooks/useLocationDetails';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { getLocationName } from '~/utils/locations';
import { generateSchedule, isLocationOpen } from '~/utils/time';
import { cn } from '~/utils/utils';

const GenericLocation = () => {
  const { location } = useLocalSearchParams<{ location: string }>();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const useColloquialNames = useSettingsStore((state) => state.useColloquialNames);
  const db = useDatabase();
  const [imageLoading, setImageLoading] = useState(true);

  const { locationData } = useLocationDetails(location || '');
  const displayName = getLocationName(db, location || '', useColloquialNames);

  const schedule = generateSchedule(locationData, false);

  const isOpen = isLocationOpen(locationData);

  const paymentMethods = Array.isArray(locationData?.methods_of_payment)
    ? locationData.methods_of_payment
    : [];

  if (!location || !locationData) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode ? '#111827' : '#fff',
        }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      <Stack.Screen
        options={{
          title: 'Generic Location',
          headerShown: false,
        }}
      />
      {/* Pull Down Indicator (outside FlatList) */}
      <View
        style={{
          alignItems: 'center',
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: isDarkMode ? '#111827' : '#fff',
        }}>
        <View
          style={{
            width: 40,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: isDarkMode ? '#fff' : '#F0F0F0',
          }}
        />
      </View>
      <Container disableInsets className="mx-0 mb-12">
        <FlatList
          data={[{}]} // dummy item just to satisfy FlatList
          keyExtractor={(_, index) => `main-content-${index}`}
          className="w-full px-6" // <-- tailwind for width: 100%
          contentContainerStyle={{
            padding: 0,
            alignItems: 'center',
            width: '100%', // now this 100% is relative to the FlatList's real width
          }}
          renderItem={() => (
            <View className="mb-6 mt-3 flex-1 flex-col gap-y-4">
              {locationData.image && (
                <View className="mb-3 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-lg">
                  {imageLoading && (
                    <View
                      className={cn(
                        'absolute inset-0 rounded-3xl',
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      )}
                    />
                  )}
                  <Image
                    className="aspect-[16/9] w-full rounded-3xl"
                    source={{ uri: locationData.image }}
                    resizeMode="cover"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                  />
                </View>
              )}

              {locationData.force_close && (
                <View className="mb-3 rounded-lg bg-red-600 px-4 py-2">
                  <Text className="text-center text-lg font-extrabold tracking-wider text-white">
                    TEMPORARILY CLOSED
                  </Text>
                </View>
              )}

              <View className="gap-2">
                <View className="flex-row items-center gap-x-2">
                  <View>
                    <Text
                      className={cn(
                        'text-3xl font-bold',
                        isDarkMode ? 'text-white' : 'text-black'
                      )}>
                      {displayName}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <View className="flex-row items-center gap-x-1">
                    <Clock size={16} color={COLORS['ut-burnt-orange']} />
                    <Text className="text-lg font-semibold text-ut-burnt-orange">
                      {isOpen ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                  <View
                    className={cn(
                      'size-1 rounded-full',
                      isDarkMode ? 'bg-ut-grey-dark-mode' : 'bg-ut-burnt-orange'
                    )}
                  />

                  {/* Location Type Pill */}
                  {locationData.type && (
                    <View>
                      <View
                        className={cn(
                          'self-start rounded-full px-3 py-1  ',
                          isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-ut-grey/5'
                        )}>
                        <Text
                          className={cn(
                            'text-xs font-bold uppercase',
                            isDarkMode ? 'text-white' : 'text-black/75'
                          )}>
                          {locationData.type}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const url =
                      Platform.OS === 'ios'
                        ? locationData.apple_maps_link
                        : locationData.google_maps_link;
                    Linking.openURL(url);
                  }}
                  className="flex-row items-center gap-x-1">
                  <MapPin
                    size={16}
                    color={isDarkMode ? COLORS['ut-grey-dark-mode'] : COLORS['ut-grey']}
                  />
                  <Text className={cn(isDarkMode ? 'text-ut-grey-dark-mode' : 'text-ut-grey')}>
                    {locationData.address}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                className={cn(
                  'my-2 h-1 w-full border-b',
                  isDarkMode ? 'border-gray-700' : 'border-b-ut-grey/15'
                )}
              />

              <Text
                className={cn(
                  'text-base leading-relaxed',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                {locationData.description}
              </Text>

              <View
                className={cn(
                  'flex-col gap-y-3 rounded-xl p-4',
                  isDarkMode ? 'bg-ut-grey-dark-mode/10' : 'bg-gray-50'
                )}>
                <Text
                  className={cn(
                    'text-2xl font-semibold',
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  )}>
                  Regular Service Hours
                </Text>
                {schedule.map((schedule, index) => (
                  <View key={index + '-schedule'} className="flex-row items-start justify-between">
                    <Text className={cn('font-medium', isDarkMode ? 'text-white' : 'text-black')}>
                      {schedule.dayRange}:
                    </Text>
                    <Text
                      className={cn(
                        'leading-loose',
                        isDarkMode ? 'text-gray-300' : 'text-ut-grey'
                      )}>
                      {schedule.time.includes(',')
                        ? schedule.time.replace(/, /g, '\n')
                        : schedule.time}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-col gap-y-3">
                <Text
                  className={cn(
                    'text-2xl font-semibold',
                    isDarkMode ? 'text-white' : 'text-black'
                  )}>
                  Methods of Payment
                </Text>
                <View className={cn('flex-row flex-wrap items-center justify-around gap-4')}>
                  {paymentMethods.map((method: string, index: number) => {
                    if (method in PAYMENT_INFO_ICONS) {
                      return (
                        <View key={index} className="items-center justify-center gap-0.5">
                          <Image
                            className="size-6"
                            source={PAYMENT_INFO_ICONS[method as keyof typeof PAYMENT_INFO_ICONS]}
                          />
                          <Text
                            className={cn(
                              'font-medium',
                              isDarkMode ? 'text-gray-300' : 'text-ut-grey'
                            )}>
                            {method}
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            </View>
          )}
        />
      </Container>
    </View>
  );
};

export default GenericLocation;
