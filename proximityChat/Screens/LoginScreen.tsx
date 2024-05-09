import React, { useEffect, useState } from 'react';
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
    const [greeting, setGreeting] = useState('')
    const Groq = require("groq-sdk");
    const groq = new Groq({
        apiKey: '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'
    });

    async function getGreeting() {
        const chatCompletion = await getGroqChatCompletion();
        console.log(chatCompletion.choices[0]?.message?.content || "");
        setGreeting(chatCompletion.choices[0]?.message?.content || "");
    }
    async function getGroqChatCompletion() {
        return groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Give me a greeting message max 3 words"
                }
            ],
            model: "llama3-8b-8192"
        });
    }

    useEffect(() => {
        getGreeting();
    }, [])

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
                    <Text style={{transform:[{rotate: '335deg'}], color:'white', left:135}}>{greeting}</Text>
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