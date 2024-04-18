import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseconfig';

export default function RegistrationPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const navigation = useNavigation();

    const registerUser = async (email, password, firstname, lastname) => {
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
                <View style={styles.signinContainer}>
                    <Text style={styles.signinText}>Already a member? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signinLink}>Login</Text>
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
    signinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    signinText: {
        color: '#c7d2f6',
        fontSize: 14,
        textAlign: 'center',
    },
    signinLink: {
        color: '#4f46e5',
        fontWeight: 'bold',
        fontSize: 14,
    },
});