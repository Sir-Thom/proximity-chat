import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseconfig';
import { styles } from '../Styles/AuthStyles';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const loginUser = async (email, password) => {
        if (email === '' || password === '') {
            Alert.alert('Invalid input', 'Please fill in all fields.');
            return;
        }
        else{
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (error) {
                Alert.alert("Login fail", "Email address or password is incorrect. Please try again.");
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer} 
            automaticallyAdjustContentInsets={true}
            automaticallyAdjustKeyboardInsets={true}
            bounces={false}>
            <View style={styles.container}>
                <StatusBar backgroundColor="#1f2937"/>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/icon-removebg.png')}
                        alt="Your Company"
                    />
                    <Text style={styles.title}>Sign in to your account</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType='email-address'
                        autoCorrect={false}
                        placeholderTextColor={'#a3a3a3'}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <View style={styles.passwordContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        placeholderTextColor={'#a3a3a3'}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => loginUser(email, password)}
                >
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
                <View style={styles.authContainer}>
                    <Text style={styles.authText}>Not a member? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.authLink}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
