import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, {useState} from 'react'
import { firebase } from '../firebaseconfig';

export default function RegistrationPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState(''); 5
    const [lastname, setLastname] = useState('');

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
    <View style={styles.container}>
        <Text style={styles.titleText}>Register here</Text>
        <View style={{marginTop:40}}>
        <TextInput
            style={styles.textInput}
            placeholder= "First Name"
            onChangeText={(text) => setFirstname(text)}
        />
        <TextInput
            style={styles.textInput}
            placeholder= "Last Name"
            onChangeText={(text) => setLastname(text)}
        />
        <TextInput
            style={styles.textInput}
            placeholder= "Email"
            keyboardType='email-address'
            onChangeText={(text) => setEmail(text)}
        />
        <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
        />
        </View>
        <TouchableOpacity
        style= {styles.button}
        onPress={() => registerUser(email, password, firstname, lastname)}

        >
        <Text style={{fontWeight: 'bold', fontSize: 22}}>Register</Text>
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
    marginTop: 50,
    height: 70,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10ABFF",
    borderRadius: 50
},
});