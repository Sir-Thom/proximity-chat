import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseconfig';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const loginUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error("Erreur de connexion:", error.message);
        }
    }

    const handleForgotPassword = () => {
        
    }

    return (
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
                    autoCorrect={false}
                    onChangeText={(text) => setEmail(text)}
                />
                <View style={styles.passwordContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => loginUser(email, password)}
            >
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <Text style={styles.signupText}>
                Not a member?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupLink}>Register</Text>
                </TouchableOpacity>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
    passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    forgotPassword: {
        color: '#4f46e5',
        fontSize: 14,
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
