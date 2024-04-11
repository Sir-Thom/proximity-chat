import "react-native-gesture-handler";
import { StyleSheet, Text, View } from 'react-native';
import MapScreen from './Screens/MapScreen';
import TestScreen from './Screens/TestScreen';
import ChatScreen from './Screens/ChatScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const stack = createStackNavigator();


export default function App() {
 // const [theme, setTheme] = useState<string>('');
  //const colorScheme = Appearance.getColorScheme();
  
 /* useEffect(() => {
    if (colorScheme === 'dark') {
      setTheme(' bg-slate-800 ');
    } else {
      setTheme(' bg-slate-100 ');
    }
  }, [colorScheme])*/

  return (
    <NavigationContainer>
      <stack.Navigator>
  
    <stack.Screen name="Map" component={MapScreen}/>
    <stack.Screen name="Chat" component={ChatScreen}/>

      </stack.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
  {/*  <View className={`flex-1 justify-center items-centered ${theme}`}>
      <StatusBar style="auto" />
    </View>
  );
}*/}

