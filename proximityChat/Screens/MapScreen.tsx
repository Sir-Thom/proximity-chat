import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Asset } from 'expo-asset';

import { firebase } from '../firebaseconfig';
import { getUserFirstnameById } from '../utils/GetUser';
import { HandleLocataionUpdate, GetLocation } from '../utils/LocationsUtils';
import { GTAMapStyle } from '../utils/mapStyle/GTAMapStyle';


// Function to calculate the distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};

const MapScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyUsers, setNearbyUsers] = useState([]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission to access location was denied');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                HandleLocataionUpdate();
            } catch (error) {
                console.error('Error fetching location:', error);
                Alert.alert('Error fetching location');
            }
        };

        fetchLocation(); // Fetch location when the component mounts

        const locationInterval = setInterval(fetchLocation, 60000); // Refresh location every 1 minute

        return () => clearInterval(locationInterval); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        const fetchNearbyUsers = async () => {
            const locationData = await GetLocation();
            setNearbyUsers(locationData || []);
            
        };

        fetchNearbyUsers(); // Fetch nearby users when the component mounts

        const nearbyUsersInterval = setInterval(fetchNearbyUsers, 10000); // Refresh nearby users every 1 minute
      
        return () => clearInterval(nearbyUsersInterval); // Clear interval on component unmount
    }, []);

    return (
        <View testID="map-view-child" style={styles.view}>
            {userLocation && (
                <MapView
                    customMapStyle={GTAMapStyle}
                    testID="map"
                    provider={PROVIDER_GOOGLE}
                    showsCompass
                    style={styles.map}
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    }}
                >
                    {nearbyUsers.map((user) => {
                        if (
                            user.userid !== firebase.auth().currentUser.uid &&
                            calculateDistance(
                                user.latitude,
                                user.longitude,
                                userLocation.latitude,
                                userLocation.longitude,
                            ) <= 100
                        ) {
                            return (
                                <Marker
                                    testID={`marker-${user.id}-${user.userid}`}
                                    key={`${user.id}-${user.userid}`}
                                    coordinate={{
                                        latitude: parseFloat(user.latitude),
                                        longitude: parseFloat(user.longitude),
                                    }}
                                    icon={Asset.fromModule(require('../assets/marker.png'))}
                                    onPress={async () => {
                                        const firstName = await getUserFirstnameById(user.userid);
                                        navigation.navigate('Chat', { name: firstName });
                                    }}
                                />
                            );
                        }
                        return null;
                    })}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapScreen;
