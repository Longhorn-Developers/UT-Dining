import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Microwave,
  Locate,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  MapPin,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '~/components/Container';
import { MICROWAVE_LOCATIONS } from '~/data/MicrowaveLocations';
import { getAllLocationsWithCoordinates } from '~/db/database';
import { useDatabase } from '~/hooks/useDatabase';
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

const NonMicrowaveMarker = ({ onPress }: { onPress: () => void }) => (
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
    <MapPin size={20} color="white" />
  </TouchableOpacity>
);

type Direction = 'north' | 'south' | 'east' | 'west';

const EdgeIndicator = ({ direction, onPress }: { direction: Direction; onPress: () => void }) => {
  const scaleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale in animation when component mounts
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // Return cleanup function for scale out animation
    return () => {
      Animated.spring(scaleAnimation, {
        toValue: 0,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    };
  }, [scaleAnimation]);

  const getPositionStyle = () => {
    const { width, height } = Dimensions.get('window');
    const indicatorSize = 60;
    const margin = 20;

    switch (direction) {
      case 'north':
        return {
          top: 140,
          left: width / 2 - indicatorSize / 2,
        };
      case 'south':
        return {
          bottom: 80,
          left: width / 2 - indicatorSize / 2,
        };
      case 'east':
        return {
          top: height / 2 - indicatorSize / 2,
          right: margin,
        };
      case 'west':
        return {
          top: height / 2 - indicatorSize / 2,
          left: margin,
        };
    }
  };

  const getIcon = () => {
    switch (direction) {
      case 'north':
        return <ChevronUp size={16} color="white" />;
      case 'south':
        return <ChevronDown size={16} color="white" />;
      case 'east':
        return <ChevronRight size={16} color="white" />;
      case 'west':
        return <ChevronLeft size={16} color="white" />;
    }
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          transform: [{ scale: scaleAnimation }],
        },
        getPositionStyle(),
      ]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          width: 60,
          height: 60,
          backgroundColor: COLORS['ut-burnt-orange'],
          borderRadius: 30,
          borderWidth: 2,
          borderColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ alignItems: 'center' }}>
          {getIcon()}
          <Microwave size={14} color="white" style={{ marginTop: 2 }} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MapMarkers = ({
  locations,
  onMarkerPress,
}: {
  locations: {
    name: string;
    address: string;
    coordinates: { latitude: number; longitude: number };
    description?: string;
    note?: string;
    isMicrowave?: boolean;
  }[];
  onMarkerPress: (coords: { latitude: number; longitude: number }) => void;
}) => {
  return (
    <>
      {locations.map((location, index) => (
        <Marker
          key={location.name + index}
          coordinate={location.coordinates}
          tracksViewChanges={false}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onMarkerPress(location.coordinates);
            SheetManager.show('microwave-location', {
              payload: {
                name: location.name,
                address: location.address,
                description: location.description ?? '',
                ...(location.note ? { note: location.note } : {}),
              },
            });
          }}>
          {location.isMicrowave ? (
            <CustomMarker
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onMarkerPress(location.coordinates);
                SheetManager.show('microwave-location', {
                  payload: {
                    name: location.name,
                    address: location.address,
                    description: location.description ?? '',
                    ...(location.note ? { note: location.note } : {}),
                  },
                });
              }}
            />
          ) : (
            <NonMicrowaveMarker
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onMarkerPress(location.coordinates);
                SheetManager.show('microwave-location', {
                  payload: {
                    name: location.name,
                    address: location.address,
                    description: location.description ?? '',
                    ...(location.note ? { note: location.note } : {}),
                  },
                });
              }}
            />
          )}
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
  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
  const db = useDatabase();
  const [dbLocations, setDbLocations] = useState<any[]>([]);

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

  useEffect(() => {
    async function fetchDbLocations() {
      if (!db) return;

      const locs = await getAllLocationsWithCoordinates(db);
      setDbLocations(locs);
    }
    fetchDbLocations();
  }, [db]);

  // Merge static and DB locations, deduplicate by lat/lng (prefer DB)
  const mergedLocations = React.useMemo(() => {
    const dbLocs = dbLocations.map((loc) => {
      // Check if this DB location matches a static microwave location
      const isMicrowave = MICROWAVE_LOCATIONS.some(
        (staticLoc) =>
          Math.abs(Number(loc.latitude) - staticLoc.coordinates.latitude) < 1e-6 &&
          Math.abs(Number(loc.longitude) - staticLoc.coordinates.longitude) < 1e-6
      );
      return {
        name: (loc.name ?? '') as string,
        address: (loc.address ?? '') as string,
        coordinates: {
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
        },
        description: loc.description ?? '',
        isMicrowave,
      };
    });
    const staticLocs = MICROWAVE_LOCATIONS.filter(
      (staticLoc) =>
        !dbLocs.some(
          (dbLoc) =>
            Math.abs(dbLoc.coordinates.latitude - staticLoc.coordinates.latitude) < 1e-6 &&
            Math.abs(dbLoc.coordinates.longitude - staticLoc.coordinates.longitude) < 1e-6
        )
    ).map((staticLoc) => ({ ...staticLoc, isMicrowave: true }));
    return [...dbLocs, ...staticLocs];
  }, [dbLocations]);

  const handleRegionChangeComplete = (region: Region) => {
    // Update current region for edge indicator calculations
    setCurrentRegion(region);
  };

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const outOfViewMicrowaves = useMemo(() => {
    // Calculate distance from initial campus center
    const distanceFromCampus = Math.sqrt(
      Math.pow(currentRegion.latitude - initialRegion.latitude, 2) +
        Math.pow(currentRegion.longitude - initialRegion.longitude, 2)
    );

    // Threshold to determine if user has scrolled away from main campus area
    const campusDistanceThreshold = 0.01;

    // Only show edge indicators when user has scrolled significantly away from campus
    const isAwayFromCampus = distanceFromCampus > campusDistanceThreshold;

    const grouped: Record<Direction, (typeof MICROWAVE_LOCATIONS)[number][]> = {
      north: [],
      south: [],
      east: [],
      west: [],
    };

    // Return empty groups if still within campus area
    if (!isAwayFromCampus) {
      return grouped;
    }

    const visibleBounds = {
      north: currentRegion.latitude + currentRegion.latitudeDelta / 2,
      south: currentRegion.latitude - currentRegion.latitudeDelta / 2,
      east: currentRegion.longitude + currentRegion.longitudeDelta / 2,
      west: currentRegion.longitude - currentRegion.longitudeDelta / 2,
    };

    MICROWAVE_LOCATIONS.forEach((location) => {
      const { latitude, longitude } = location.coordinates;

      // Check if microwave is outside visible bounds
      const isOutOfView =
        latitude > visibleBounds.north ||
        latitude < visibleBounds.south ||
        longitude > visibleBounds.east ||
        longitude < visibleBounds.west;

      if (isOutOfView) {
        // Determine primary direction
        const latDiff = latitude - currentRegion.latitude;
        const lonDiff = longitude - currentRegion.longitude;

        if (Math.abs(latDiff) > Math.abs(lonDiff)) {
          // Primary direction is north/south
          if (latDiff > 0) {
            grouped.north.push(location);
          } else {
            grouped.south.push(location);
          }
        } else {
          // Primary direction is east/west
          if (lonDiff > 0) {
            grouped.east.push(location);
          } else {
            grouped.west.push(location);
          }
        }
      }
    });

    // Find the direction with the most microwaves
    const directionWithMost = Object.entries(grouped).reduce(
      (max, [direction, locations]) => {
        return locations.length > max.count
          ? { direction: direction as Direction, count: locations.length }
          : max;
      },
      { direction: 'north' as Direction, count: 0 }
    );

    // Return only the direction with the most microwaves
    return {
      [directionWithMost.direction]: grouped[directionWithMost.direction],
    };
  }, [currentRegion]);

  const navigateToDirection = (direction: Direction) => {
    const microwavesInDirection = outOfViewMicrowaves[direction];
    if (microwavesInDirection.length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Find the closest microwave in that direction
    const closest = microwavesInDirection.reduce((closest, current) => {
      const closestDistance = Math.sqrt(
        Math.pow(closest.coordinates.latitude - currentRegion.latitude, 2) +
          Math.pow(closest.coordinates.longitude - currentRegion.longitude, 2)
      );
      const currentDistance = Math.sqrt(
        Math.pow(current.coordinates.latitude - currentRegion.latitude, 2) +
          Math.pow(current.coordinates.longitude - currentRegion.longitude, 2)
      );
      return currentDistance < closestDistance ? current : closest;
    });

    // Animate to the closest microwave
    mapRef.current?.animateToRegion(
      {
        latitude: closest.coordinates.latitude,
        longitude: closest.coordinates.longitude,
        latitudeDelta: 0.0075,
        longitudeDelta: 0.0075,
      },
      500
    );
  };

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

      mapRef.current.animateToRegion({
        latitude: userLat,
        longitude: userLong,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
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
          onRegionChangeComplete={handleRegionChangeComplete}
          userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
          loadingEnabled
          loadingBackgroundColor={isDarkMode ? 'rgba(17,24,39,0.7)' : 'rgba(255,255,255,0.9)'}>
          <MapMarkers locations={mergedLocations} onMarkerPress={handleMarkerPress} />
        </MapView>

        {/* Edge Indicators */}
        {Object.entries(outOfViewMicrowaves).map(([direction, locations]) => {
          if (locations.length === 0) return null;

          return (
            <EdgeIndicator
              key={direction}
              direction={direction as Direction}
              onPress={() => navigateToDirection(direction as Direction)}
            />
          );
        })}

        {/* Location Button */}
        {hasLocationPermission && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              centerOnUser();
            }}
            className={cn(
              'absolute bottom-12 right-12 rounded-full p-4',
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
