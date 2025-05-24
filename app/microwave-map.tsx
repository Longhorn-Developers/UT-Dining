import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Microwave } from 'lucide-react-native';
import { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '~/components/Container';
import { MICROWAVE_LOCATION } from '~/data/MicrowaveLocations';
import { useSettingsStore } from '~/store/useSettingsStore';
import { COLORS } from '~/utils/colors';
import { cn } from '~/utils/utils';

const initialRegion = {
  latitude: 30.285548,
  longitude: -97.737384,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const CustomMarker = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      backgroundColor: COLORS['ut-burnt-orange'],
      padding: 8,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    }}>
    <Microwave size={20} color="white" />
  </TouchableOpacity>
);

const MapMarkers = ({
  onMarkerPress,
}: {
  onMarkerPress: (coords: { latitude: number; longitude: number }) => void;
}) => {
  return (
    <>
      {MICROWAVE_LOCATION.map((location, index) => (
        <Marker
          key={index}
          coordinate={location.coordinates}
          tracksViewChanges={false}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Center the map on this location
            onMarkerPress(location.coordinates);
            // Show the details sheet
            SheetManager.show('microwave-location', {
              payload: {
                name: location.name,
                address: location.address,
                description: location.description,
                ...('note' in location ? { note: location.note } : {}),
              },
            });
          }}>
          <CustomMarker
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onMarkerPress(location.coordinates);
              SheetManager.show('microwave-location', {
                payload: {
                  name: location.name,
                  address: location.address,
                  description: location.description,
                  ...('note' in location ? { note: location.note } : {}),
                },
              });
            }}
          />
        </Marker>
      ))}
    </>
  );
};

const MicrowaveMap = () => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMarkerPress = (coordinates: { latitude: number; longitude: number }) => {
    // Just animate to the region without setting the state directly
    // This creates a smoother animation
    mapRef.current?.animateToRegion(
      {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.0075,
        longitudeDelta: 0.0075,
      },
      500
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      {/* Header Bar with Back Button and Title */}
      <View
        className={cn(
          'absolute z-10 flex w-full flex-row items-center px-5',
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        )}
        style={{
          top: 0,
          paddingTop: insets.top + 10,
          paddingBottom: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <TouchableOpacity
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          )}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            SheetManager.hide('microwave-location');
            router.back();
          }}>
          <ChevronLeft size={24} color={COLORS['ut-burnt-orange']} />
        </TouchableOpacity>
        <Text
          className={cn(
            'ml-4 font-sans text-3xl font-extrabold',
            isDarkMode ? 'text-white' : 'text-gray-800'
          )}>
          Microwave Map
        </Text>
      </View>

      <Container
        disableBottomPadding
        className={cn('mx-0 gap-6', isDarkMode ? 'bg-gray-900' : 'bg-white')}>
        <Stack.Screen
          options={{
            title: 'Microwave Map',
            headerShown: false,
          }}
        />

        <MapView
          ref={mapRef}
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(51, 63, 72, 0.15)',
          }}
          provider={PROVIDER_DEFAULT}
          initialRegion={initialRegion}
          userInterfaceStyle={isDarkMode ? 'dark' : 'light'}>
          <MapMarkers onMarkerPress={handleMarkerPress} />
        </MapView>
      </Container>
    </View>
  );
};

export default MicrowaveMap;
