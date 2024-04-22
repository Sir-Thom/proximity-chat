import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseconfig';
import { styles } from '../Styles/AuthStyles';

export default function RegistrationPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const navigation = useNavigation();

    const registerUser = async (email, password, firstname, lastname) => {
        if (email === '' || password === '' || firstname === '' || lastname === '') {
            Alert.alert('Invalid input', 'Please fill in all fields.');
            return;
        }
        else {
            try{
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                    email,
                    firstname,
                    lastname
                    })
                    .then(() => {
                    firebase.auth().currentUser.sendEmailVerification({handleCodeInApp: true, url: 'http://democours-4fc4e.firebaseapp.com'})
                    })
                    .catch((error) => {
                    console.log(error)
                    })
                })
            } catch (error) {
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Badly formatted email', 'Please enter a valid email address.');
                }
                else if (error.code === 'auth/weak-password') {
                    Alert.alert('Weak password', 'Please enter a stronger password. (Minimum 6 characters)');
                }
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer} 
            automaticallyAdjustContentInsets={true}
            automaticallyAdjustKeyboardInsets={true}
            bounces={false}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={require('../assets/icon-removebg.png')}
                            alt="Your Company"
                        />
                        <Text style={styles.title}>Create a new account</Text>
                    </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder= "First Name"
                        autoCorrect={false}
                        placeholderTextColor={'#a3a3a3'}
                        onChangeText={(text) => setFirstname(text)}
                    />
                    <Text style={styles.label}>Last name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder= "Last Name"
                        autoCorrect={false}
                        placeholderTextColor={'#a3a3a3'}
                        onChangeText={(text) => setLastname(text)}
                    />
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder= "Email"
                        keyboardType='email-address'
                        autoCorrect={false}
                        placeholderTextColor={'#a3a3a3'}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Text style={styles.label}>Password</Text>
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
                    style= {styles.button}
                    onPress={() => registerUser(email, password, firstname, lastname)}
                >
                <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <View style={styles.authContainer}>
                    <Text style={styles.authText}>Already a member? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.authLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}