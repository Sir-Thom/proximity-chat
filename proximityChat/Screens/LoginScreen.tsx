import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseconfig';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const loginUser = async (email, password) => {
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {})
    }

    return (  
        <View style={styles.container}>
            <Text style= {styles.titleText}>Login</Text>
            <View style={{marginTop:40}}>
            <TextInput 
                style={styles.textInput}
                placeholder="Email"
                autoCorrect = {false}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput 
                style={styles.textInput}
                placeholder="Password"
                autoCorrect = {false}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            </View>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => loginUser(email, password)}
            >
                <Text style = {styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{marginTop:20}}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style = {styles.SecondaryButtonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{marginTop:20}}
            >
                <Text style = {styles.SecondaryButtonText}>Foget Password?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 100,
    },
    textInput: {
        paddingTop: 20,
        paddingBottom: 10,
        width: 250,
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginBottom: 10,
        textAlign: "center"
    },
    titleText: {
        fontSize: 26,
        fontWeight: "bold",
        marginLeft: 10,
        marginTop: 10
    },
    button: {
        marginTop: 40,
        height: 70,
        width: 250,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10ABFF",
        borderRadius: 50
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 22
    },
    SecondaryButtonText: {
        fontWeight: "bold",
        fontSize: 16
    }
});