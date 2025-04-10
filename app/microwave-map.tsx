import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Container } from '~/components/Container';
import { Stack } from 'expo-router';
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps';
import TopBar from '~/components/TopBar';
import { MICROWAVE_LOCATION } from '~/data/MicrowaveLocations';

const MapMarkers = () => {
    return (
        <>
            {MICROWAVE_LOCATION.map((location, index) => (
                <Marker
                    key={index}
                    coordinate={location.coordinates}
                    title={location.name}
                    pinColor="#BF5700"
                >
                    <Callout>
                        <View className="p-2">
                            <CalloutSubview
                                className='my-10'
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    const encodedAddress = encodeURIComponent(location.address.replace(/\s/g, '+'));
                                    const url = Platform.OS === 'ios' ? `maps://maps.apple.com/?address=${encodedAddress}` : `https://www.google.com/maps/place/${encodedAddress}`;
                                    Linking.openURL(url);
                                }}
                            >
                                <Text className="font-bold mb-1">{location.name}</Text>
                                <Text className="mb-1 text-ut-grey text-base">{location.address}</Text>
                                <Text className="text-sm">{location.description}</Text>
                                {location.note && <Text className="text-xs mt-1 font-bold">{location.note}</Text>}
                            </CalloutSubview>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </>
    )
}

const MicrowaveMap = () => {
    return (
        <Container className='mx-0' disableBottomPadding>
            <Stack.Screen
                options={{
                    title: 'Microwave Map',
                }}
            />
            <View className="flex gap-y-5 mx-6">
                <TopBar variant="back"  />
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
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 30.285548,
                    longitude: -97.737384,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <MapMarkers/>
            </MapView>
        </Container>
    );
};

export default MicrowaveMap;
