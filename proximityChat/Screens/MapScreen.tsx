import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { createStackNavigator } from '@react-navigation/stack';
import data from './test.json';

const stack = createStackNavigator();

const MapScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    setNearbyUsers(data.users);
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Location.watchPositionAsync({}, (location) => {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      });
    };

    getLocation();

    return () => {
      Location.stopLocationUpdatesAsync('taskName');
    };
  }, []);

  return (
    <View style={styles.view}>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.03, // Adjust zoom level
            longitudeDelta: 0.03,
          }}
        >
          <Marker coordinate={userLocation} title="You" />
          {nearbyUsers.map(user => (
            <Marker
              key={user.id}
              coordinate={{ latitude: parseFloat(user.latitude), longitude: parseFloat(user.longitude) }}
              title={user.name}
              onPress={() => navigation.navigate("Chat", { name: user.name })}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;

