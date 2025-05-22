import { MapPin, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Platform, ScrollView } from 'react-native';

import { LOCATION_INFO, getLocationName } from '~/data/LocationInfo';
import { PAYMENT_INFO_ICONS, PaymentMethod } from '~/data/PaymentInfo';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { generateSchedule, isLocationOpen } from '~/utils/time';

const paymentMethods: PaymentMethod[] = Object.keys(PAYMENT_INFO_ICONS) as PaymentMethod[];

interface CoffeeShopSectionProps {
  locationName: string;
}

const CoffeeShopSection = ({ locationName }: CoffeeShopSectionProps) => {
  const location = LOCATION_INFO.find((loc) => loc.name === locationName);
  const { useColloquialNames } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const open = isLocationOpen(locationName);
      setIsOpen(open);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [locationName]);

  if (!location) return null;

  const schedule = generateSchedule(location.name, false);

  return (
    <ScrollView
      className="flex-1 py-6"
      contentContainerStyle={{ padding: 0, alignItems: 'center' }}>
      {/* Image */}
      {location.image && (
        <Image
          source={{ uri: location.image }}
          style={{
            width: '90%',
            height: 200,
            borderRadius: 24,
            marginBottom: 24,
            marginTop: 8,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
          resizeMode="cover"
        />
      )}
      <View className="w-full flex-col gap-y-4 px-6">
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-center gap-x-2">
            <Text className="text-3xl font-bold">
              {getLocationName(location.name, useColloquialNames)}
            </Text>
          </View>

          {/* Open/Closed Status */}
          <View className="flex-row items-center gap-x-2">
            <View className="flex-row items-center gap-x-1">
              <Clock size={16} color={COLORS['ut-burnt-orange']} />
              <Text className="text-lg font-semibold text-ut-burnt-orange">
                {isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                Linking.openURL(location.appleMapsLink);
              } else {
                Linking.openURL(location.googleMapsLink);
              }
            }}
            className="flex-row items-center gap-x-1">
            <MapPin size={16} color={COLORS['ut-burnt-orange']} />
            <Text className="text-ut-grey">{location.address}</Text>
          </TouchableOpacity>
        </View>

        <View className="my-2 w-full border-b border-b-ut-grey/15" />

        {/* Description */}
        <Text className="text-base leading-relaxed text-gray-700">{location.description}</Text>

        {/* Hours */}
        <View className="flex-col gap-y-3 rounded-xl bg-gray-50 p-4">
          <Text className="text-2xl font-semibold text-gray-800">Regular Service Hours</Text>
          {schedule.map((sch, index) => (
            <View key={index + '-schedule'} className="flex-row items-start justify-between">
              <Text className="font-medium text-gray-700">{sch.dayRange}:</Text>
              <Text className="text-right leading-loose text-ut-grey">
                {sch.time.includes(',') ? sch.time.replace(/, /g, '\n') : sch.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View className="flex-col gap-y-3 rounded-xl bg-gray-50 p-4">
          <Text className="text-2xl font-semibold text-gray-800">Methods of Payment</Text>
          <View className="flex-row flex-wrap items-center justify-between gap-4">
            {paymentMethods.map((method, index) => (
              <View key={index} className="items-center justify-center gap-0.5">
                <Image className="mb-1 size-6" source={PAYMENT_INFO_ICONS[method]} />
                <Text className="font-medium text-ut-grey">{method}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CoffeeShopSection;
