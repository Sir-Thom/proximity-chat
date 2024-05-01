import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
    Alert,
    ScrollView,
} from 'react-native';

import { firebase } from '../firebaseconfig';
import { styles } from '../Styles/AuthStyles';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const resetPassword = async (email) => {
        try {
            await firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    Alert.alert(
                        'Email send',
                        'If the email address is valid, you will receive an email with instructions to reset your password.',
                    );
                });
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                Alert.alert('Badly formatted email', 'Please enter a valid email address.');
            } else Alert.alert('Invalid email', 'Please enter a valid email address.');
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
                    <Text style={styles.title}>Reset your account password</Text>
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
                </View>
                <TouchableOpacity style={styles.button} onPress={() => resetPassword(email)}>
                    <Text style={styles.buttonText}>Reset password</Text>
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
