import "react-native-gesture-handler";
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import React, { useEffect, useState } from "react";
import MapScreen from './Screens/MapScreen';
import ChatScreen from "./Screens/ChatScreen";
import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from "./Screens/ForgotPasswordScreen";
import { NavigationContainer, DefaultTheme, useTheme, DarkTheme} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const stack = createStackNavigator();
import { firebase } from './firebaseconfig';
import { DarkHeaderTheme } from "./utils/themeDarkHeader";

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
      <stack.Navigator >
        <stack.Screen name="Login"  component={LoginScreen} options={{headerShown: false}}/>
        <stack.Screen name="Register" component={RegistrationScreen} options={{headerShown: false}}/>
        <stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}}/>
      </stack.Navigator>
    );
  }

  return (
    <stack.Navigator>
      <stack.Screen name="Map" component={MapScreen}  />

      <stack.Screen name="Chat" component={ChatScreen}/>
    </stack.Navigator>
  );
}

export default () => {
  
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkHeaderTheme : DarkHeaderTheme}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <App />
    </NavigationContainer>
  );
}


