import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapScreen from "./Component/map"


export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      
      <MapScreen/>
      <StatusBar style="auto" />
    </View>
  );
}

