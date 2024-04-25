import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../Styles/AuthStyles';
import { firebase } from '../firebaseconfig';

type RouteParams = {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
};

export default function RegisterProfilePicturePage() {
    const route = useRoute();
    const { email, firstname, lastname, password} = route.params as RouteParams;
    const [image, setImage] = useState(null);
    const [passwordVerification, setPasswordVerification] = useState('');
    const navigation = useNavigation();

    const registerUser = async () => {
        if ( passwordVerification != password ) {
            Alert.alert('Invalid password', 'Passwords do not match. Please try again.');
            return;
        }
        else if (image === null) {
            Alert.alert('No profile picture', 'Please select a profile picture.');
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
                    .then(() => {
                        uploadImage();
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

    const uploadImage = async () => {
        if (image != null) {
            const response = await fetch(image);
            const blob = await response.blob();
            const filename = image.substring(image.lastIndexOf('/') + 1);
            const ref = firebase.storage().ref().child("images/" + firebase.auth().currentUser.uid + '/profilePicture/' + filename);
            await ref.put(blob);
            const imageUrl = await ref.getDownloadURL();
            const userDocRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
            await userDocRef.set({ profilePictureUrl: imageUrl }, { merge: true });
            try{
                await ref;
            }
            catch(e){
                console.log(e);
            }
            Alert.alert("Registration successful", "A verification email has been sent to your email address.");
            setImage(null);
        }
    }

    const pickImage = async (mode) => {
        try {
            if (mode === 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.canceled) {
                    setImage(result.assets[0].uri);
                }
            }
            else if (mode === 'camera') {
                await ImagePicker.requestCameraPermissionsAsync();
                let result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.canceled) {
                    setImage(result.assets[0].uri);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer} 
            automaticallyAdjustContentInsets={true}
            automaticallyAdjustKeyboardInsets={true}
            bounces={false}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <View style={{padding: 25}}>
                            <Text style={styles.title}>Choose a profile picture</Text>
                        </View>                        
                        <Image source={{ uri: image }} style={styles.picture} />
                        <View style={{flexDirection: 'row',}}>
                            <View style={{paddingRight: 15}}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => pickImage('camera')}
                                >
                                    <Text style={styles.buttonText}>Camera</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{paddingLeft: 15}}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => pickImage('gallery')}
                                >
                                    <Text style={styles.buttonText}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                        <View style={styles.inputContainer}>
                        <Text style={styles.label}>Verify your information :</Text> 
                        <Text style={styles.input}>Name : {firstname}</Text>
                        <Text style={styles.input}>Lastname : {lastname}</Text>
                        <Text style={styles.input}>Email : {email}</Text>
                        <Text style={styles.label}>Enter your password :</Text> 
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            autoCorrect={false}
                            secureTextEntry={true}
                            placeholderTextColor={'#a3a3a3'}
                            onChangeText={(text) => setPasswordVerification(text)}
                        />
                    </View>
                    <TouchableOpacity
                        style= {styles.button}
                        onPress={registerUser}
                    >
                        <Text style={styles.buttonText}>Finalize registration</Text>
                    </TouchableOpacity>
                </View>
        </ScrollView>
    );
};

