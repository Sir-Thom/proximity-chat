import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapCustom() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function getLocationAsync() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error getting current location: ' + error.message);
      }
    }

    getLocationAsync();
  }, []);

  const handleMapPress = (event) => {
    const newMarker = {
      coordinate: event.nativeEvent.coordinate,
      title: 'New Marker',
      description: 'This is a new marker',
    };
    setMarkers([...markers, newMarker]);
  };

  return (
    <View className="flex-1 relative">
      {errorMsg && <Text>{errorMsg}</Text>}
      {location ? (
        <MapView
        
        className="flex  relative justify-center align-middle inset-0  min-h-full min-w-full  w-full h-full"
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
 
}
 const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});
