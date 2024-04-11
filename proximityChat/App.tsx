import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Appearance } from 'react-native';
import ChatScreen from './Screens/ChatScreen';
import { useEffect, useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState<string>('');
  const colorScheme = Appearance.getColorScheme();
  
  useEffect(() => {
    if (colorScheme === 'dark') {
      setTheme(' bg-slate-800 ');
    } else {
      setTheme(' bg-slate-100 ');
    }
  }, [colorScheme])

  return (
    <View className={`flex-1 justify-center items-centered ${theme}`}>
      <StatusBar style="auto" />
    </View>
  );
}

