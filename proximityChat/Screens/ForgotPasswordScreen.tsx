import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseconfig';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const resetPassword = async (email) => {
        try {
            await firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert('Email envoyé', 'Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.');
            })
        } catch (error) {
            console.error("Erreur de connexion:", error.message);
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
                    <Text style={styles.title}>Reset your account password</Text>
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
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => resetPassword(email)}
                >
                <Text style={styles.buttonText}>Reset password</Text>
                </TouchableOpacity>
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Not a member? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.signupLink}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: '#1f2937'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        backgroundColor: '#1f2937',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 10,
        borderRadius: 10,
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#4f46e5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    signupText: {
        color: '#c7d2f6',
        fontSize: 14,
        textAlign: 'center',
    },
    signupLink: {
        color: '#4f46e5',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
