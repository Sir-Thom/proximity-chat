import { Text, View, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import React, {useState} from 'react'
import { styles } from '../Styles/AuthStyles';
import { firebase } from '../firebaseconfig';

export default function RegistrationPage ({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const sendData = {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname
    }

    const chooseProfilePicture = () => {
        if (email === '' || password === '' || firstname === '' || lastname === '') {
            Alert.alert('Invalid input', 'Please fill in all fields.');
            return;
        }
        navigation.navigate('ProfilePicture', sendData);
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            automaticallyAdjustContentInsets
            automaticallyAdjustKeyboardInsets
            bounces={false}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../assets/icon-removebg.png')}
                    />
                    <Text style={styles.title}>Create a new account</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        autoCorrect={false}
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setFirstname(text)}
                    />
                    <Text style={styles.label}>Last name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        autoCorrect={false}
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setLastname(text)}
                    />
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCorrect={false}
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        autoCorrect={false}
                        secureTextEntry
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
                <TouchableOpacity
                    style= {styles.button}
                    onPress={chooseProfilePicture}
                >
                <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <View style={styles.authContainer}>
                    <Text style={styles.authText}>Already a member? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                        <Text style={styles.authLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}