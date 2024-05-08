import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    Alert,
    StyleSheet,
} from 'react-native';

import { firebase } from '../firebaseconfig';
import { styles } from '../Styles/AuthStyles';

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (email, password) => {
        if (email === '' || password === '') {
            Alert.alert('Invalid input', 'Please fill in all fields.');
            return;
        } else {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (error) {
                Alert.alert(
                    'Login fail',
                    'Email address or password is incorrect. Please try again.',
                );
            }
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            automaticallyAdjustContentInsets
            automaticallyAdjustKeyboardInsets
            bounces={false}>
            <View style={styles.container}>
                <StatusBar backgroundColor="#1f2937" />
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../assets/icon-removebg.png')}
                        alt="Your Company"
                    />
                    <Text style={styles.title}>Sign in to your account</Text>
                    <Text style={{transform:[{rotate: '315deg'}], color:'white', left:125}}>Diagonal</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCorrect={false}
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setEmail(text)}
                    />
                    <View style={styles.passwordContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword' as never)}>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        autoCorrect={false}
                        secureTextEntry
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => loginUser(email, password)}>
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