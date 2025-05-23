import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import MapView, { Marker, Callout, CalloutSubview, PROVIDER_DEFAULT } from 'react-native-maps';

import { Container } from '~/components/Container';
import TopBar from '~/components/TopBar';
import { MICROWAVE_LOCATION } from '~/data/MicrowaveLocations';
import { COLORS } from '~/utils/colors';

const MapMarkers = () => {
  return (
    <>
      {MICROWAVE_LOCATION.map((location, index) => (
        <Marker
          key={index}
          coordinate={location.coordinates}
          title={location.name}
          pinColor={COLORS['ut-burnt-orange']}>
          <Callout>
            <View className="p-2">
              <CalloutSubview
                className="my-10"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const encodedAddress = encodeURIComponent(location.address.replace(/\s/g, '+'));
                  const url =
                    Platform.OS === 'ios'
                      ? `maps://maps.apple.com/?address=${encodedAddress}`
                      : `https://www.google.com/maps/place/${encodedAddress}`;
                  Linking.openURL(url);
                }}>
                <Text className="text-base font-bold">{location.name}</Text>
                <Text className="mb-1 text-base text-ut-grey">{location.address}</Text>
                <Text className="text-base">{location.description}</Text>
                {location.note && <Text className="mt-1 text-xs font-bold">{location.note}</Text>}
              </CalloutSubview>
            </View>
          </Callout>
        </Marker>
      ))}
    </>
  );
};

const MicrowaveMap = () => {
  return (
    <Container className="mx-0 gap-6" disableBottomPadding>
      <Stack.Screen
        options={{
          title: 'Microwave Map',
        }}
      />
      <View className="mx-6 flex gap-y-5">
        <TopBar variant="back" />
        <View>
          <View className="flex-row items-center gap-x-2">
            <Text className="text-3xl font-extrabold">Microwave Map</Text>
          </View>
          <Text className="font-medium text-ut-grey">
            Find locations of all microwaves on campus!
          </Text>
        </View>
      </View>
      <MapView
        style={{ flex: 1, borderTopWidth: 1, borderColor: 'rgba(51, 63, 72, 0.15)' }}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 30.285548,
          longitude: -97.737384,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <MapMarkers />
      </MapView>
    </Container>
  );
};

export default MicrowaveMap;
