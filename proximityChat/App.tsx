import 'react-native-gesture-handler';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from './Screens/ChatsScreen';
import { Ionicons } from 'react-native-vector-icons';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';

import ChatScreen from './Screens/ChatScreen';
import LoginScreen from './Screens/LoginScreen';
import MapScreen from './Screens/MapScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import RegisterProfilePicture from './Screens/RegisterProfilePictureScreen';
import { firebase } from './firebaseconfig';
import { DarkHeaderTheme } from './utils/themeDarkHeader';

const stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Profile') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    } else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Chats') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Profile" component={LoginScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Chats" component={ChatsScreen} />
        </Tab.Navigator>
    );
}

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
    }, []);

    if (initializing) return null;

    if (!user) {
        return (
            <stack.Navigator>
                <stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="Register"
                    component={RegistrationScreen}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="RegisterProfilePicture"
                    component={RegisterProfilePicture}
                    options={{ headerShown: false }}
                />
                <stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                    options={{ headerShown: false }}
                />
            </stack.Navigator>
        );
    }

    return (
        <stack.Navigator>
            <stack.Screen name="MyTabs" component={MyTabs} options={{ headerShown: false }} />
            <stack.Screen name="Map" component={MapScreen} />
            <stack.Screen name="Chat" component={ChatScreen} />
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
};
