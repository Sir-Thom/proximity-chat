import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapCustom from "./Component/map"


export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      
      <Text className='text-center mt-3 text-2xl font-semibold text-orange-300'>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

