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
        (async () => {
            const location = await GetLocation();
            if (location) {
                setNearbyUsers(location);
            }
        })();
    }, []);

// add  auto refresh location


    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    const autoRefreshLocation = () => {
        setInterval(() => {
            (async () => {
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
            })();
        }, 10000);
    }

    autoRefreshLocation();

    return (
        <View testID="map-view-child" style={styles.view}>
           
            {userLocation && (
                <MapView
                    // check if the user has dark mode enabled
                    customMapStyle={GTAMapStyle}
                    testID="map"
                    provider={PROVIDER_GOOGLE}
                    showsCompass
                    style={styles.map}
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.03, // Adjust zoom level
                        longitudeDelta: 0.03,
                    }}> 
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
                                    testID='marker'
                                    key={user.id + user.userid}
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
