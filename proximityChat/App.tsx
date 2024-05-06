import 'react-native-gesture-handler';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from './Screens/ChatsScreen';
import { Ionicons } from 'react-native-vector-icons';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Image, useColorScheme } from 'react-native';

import ChatScreen from './Screens/ChatScreen';
import LoginScreen from './Screens/LoginScreen';
import MapScreen from './Screens/MapScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import RegisterProfilePicture from './Screens/RegisterProfilePictureScreen';
import UserProfile from './Screens/ProfileScreen';
import { firebase } from './firebaseconfig';
import { DarkHeaderTheme, LigthHeaderTheme } from './utils/themeDarkHeader';
import { darkTheme } from '@flyerhq/react-native-chat-ui';

const stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        fetchUserProfilePicture();
    }, []);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                const unsubscribeProfile = userDocRef.onSnapshot((doc) => {
                    if (doc.exists) {
                        const newProfileUrl = doc.data().profilePictureUrl;
                        setProfilePicture(newProfileUrl);
                    }
                });
                return () => unsubscribeProfile();
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserProfilePicture = async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const profilePictureUrl = userDoc.data().profilePictureUrl;
                    setProfilePicture(profilePictureUrl);
                } else {
                    console.log('User document does not exist');
                }
            }
        } catch (error) {
            console.log('Error fetching user profile picture:', error);
        }
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'My profile') {
                        return (
                            <View style={{ width: size, height: size }}>
                                <Image
                                    source={{ uri: profilePicture }}
                                    style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
                                />
                            </View>
                        );
                    }
                    let iconName;

                    if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Chats') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Chats" component={ChatsScreen} />
            <Tab.Screen name="My profile" component={UserProfile} />
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
            <stack.Screen name="My profile" component={UserProfile} />
        </stack.Navigator>
    );
}

export default () => {
    const scheme = useColorScheme();
    return (
        <NavigationContainer theme={scheme === 'dark' ? DarkHeaderTheme : LigthHeaderTheme}>
            <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
            <App />
        </NavigationContainer>
    );
};
