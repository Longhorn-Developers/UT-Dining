import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Microwave, Locate } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '~/components/Container';
import { MICROWAVE_LOCATIONS } from '~/data/MicrowaveLocations';
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
      {MICROWAVE_LOCATIONS.map((location, index) => (
        <Marker
          key={location.name + index}
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
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Enable location services to see your position on the map.',
          [{ text: 'OK' }]
        );
        return;
      }
      setHasLocationPermission(true);

      // Get initial location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);

      // Watch for location updates
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation: Location.LocationObject) => {
          setUserLocation(newLocation);
        }
      );

      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  const allowedBounds = {
    north: 30.31,
    south: 30.26,
    east: -97.72,
    west: -97.76,
  };

  const handleRegionChangeComplete = (region: Region) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    const maxLatitudeDelta = 0.015;
    const maxLongitudeDelta = 0.015;

    // Clamp the coordinates to the allowed bounds
    const clampedLatitude = Math.max(allowedBounds.south, Math.min(allowedBounds.north, latitude));
    const clampedLongitude = Math.max(allowedBounds.west, Math.min(allowedBounds.east, longitude));

    // Clamp the deltas to the maximum allowed zoom
    const clampedLatitudeDelta = Math.min(latitudeDelta, maxLatitudeDelta);
    const clampedLongitudeDelta = Math.min(longitudeDelta, maxLongitudeDelta);

    // Only animate if the region needs to be adjusted
    if (
      latitude !== clampedLatitude ||
      longitude !== clampedLongitude ||
      latitudeDelta !== clampedLatitudeDelta ||
      longitudeDelta !== clampedLongitudeDelta
    ) {
      mapRef.current?.animateToRegion({
        latitude: clampedLatitude,
        longitude: clampedLongitude,
        latitudeDelta: clampedLatitudeDelta,
        longitudeDelta: clampedLongitudeDelta,
      });
    }
  };

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMarkerPress = (coordinates: { latitude: number; longitude: number }) => {
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

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      const userLat = userLocation.coords.latitude;
      const userLong = userLocation.coords.longitude;

      // Check if user is within bounds
      if (
        userLat <= allowedBounds.north &&
        userLat >= allowedBounds.south &&
        userLong <= allowedBounds.east &&
        userLong >= allowedBounds.west
      ) {
        mapRef.current.animateToRegion({
          latitude: userLat,
          longitude: userLong,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } else {
        // Alert user they're outside the viewable area
        Alert.alert('Out of Range', 'You’re currently outside the UT campus area.', [
          { text: 'OK' },
        ]);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
      {/* Header Bar with Back Button and Title */}
      <View
        className={cn(
          'absolute z-10 w-full flex-row items-center px-5',
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
            'h-10 w-10 items-center justify-center rounded-full',
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
          showsUserLocation={hasLocationPermission}
          followsUserLocation={Boolean(
            userLocation &&
              userLocation.coords.latitude <= allowedBounds.north &&
              userLocation.coords.latitude >= allowedBounds.south &&
              userLocation.coords.longitude <= allowedBounds.east &&
              userLocation.coords.longitude >= allowedBounds.west
          )}
          onRegionChangeComplete={handleRegionChangeComplete}
          userInterfaceStyle={isDarkMode ? 'dark' : 'light'}>
          <MapMarkers onMarkerPress={handleMarkerPress} />
        </MapView>

        {/* Location Button */}
        {hasLocationPermission && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              centerOnUser();
            }}
            className={cn(
              'absolute bottom-12 right-12 rounded-full p-4 shadow-lg',
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            )}>
            <Locate size={24} color={COLORS['ut-burnt-orange']} />
          </TouchableOpacity>
        )}
      </Container>
    </View>
  );
};

export default MicrowaveMap;
