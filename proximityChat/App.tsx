import "react-native-gesture-handler";
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from "react";
import MapScreen from './Screens/MapScreen';
import TestScreen from './Screens/TestScreen';
import ChatScreen from "./Screens/ChatScreen";
import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from "./Screens/ForgotPasswordScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const stack = createStackNavigator();
import { firebase } from './firebaseconfig';

function App() {
 // const [theme, setTheme] = useState<string>('');
  //const colorScheme = Appearance.getColorScheme();
  
  /* useEffect(() => {
    if (colorScheme === 'dark') {
      setTheme(' bg-slate-800 ');
    } else {
      setTheme(' bg-slate-100 ');
    }
  }, [colorScheme])*/

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]);
  
  if (initializing) return null;

  if (!user) {
    return (
      <stack.Navigator>
        <stack.Screen name="Login" component={LoginScreen} options={{headerShown:false, animationEnabled: false}}/>
        <stack.Screen name="Register" component={RegistrationScreen} options={{headerShown:false, animationEnabled: false}}/>
        <stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown:false, animationEnabled: false}}/>
      </stack.Navigator>
    );
  }

  return (
    <stack.Navigator>
      <stack.Screen name="Map" component={MapScreen}/>
      <stack.Screen name="Chat" component={ChatScreen}/>
    </stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
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

