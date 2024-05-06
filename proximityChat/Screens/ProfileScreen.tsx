import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../Styles/AuthStyles';
import { firebase } from '../firebaseconfig';

import GetUserInfoBtn from '../Components/GetUserInfoBtn';

export default function RegisterProfilePicturePage({ navigation }) {
    const [image, setImage] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [newFirstname, setNewFirstname] = useState('');
    const [newLastname, setNewLastname] = useState('');
    const [firstnameInput, setFirstnameInput] = useState('');
    const [lastnameInput, setLastnameInput] = useState('');


    useEffect(() => {
        fetchUserProfileData();
    }, []);

    const firstnameChange = (text) => {
        setFirstnameInput(text);
        setNewFirstname(text);
    }

    const lastnameChange = (text) => {
        setLastnameInput(text);
        setNewLastname(text);
    }

    const clear = () => {
        setFirstnameInput('');
        setLastnameInput('');
        setNewFirstname(firstname);
        setNewLastname(lastname);
        setImage(null);
    };

    const fetchUserProfileData = async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const profilePictureUrl = userDoc.data().profilePictureUrl;
                    setProfilePicture(profilePictureUrl);
                    const firstname = userDoc.data().firstname;
                    setFirstname(firstname);
                    setNewFirstname(firstname);
                    const lastname = userDoc.data().lastname;
                    setLastname(lastname);
                    setNewLastname(lastname);
                } else {
                    console.log('User document does not exist');
                }
            }
        } catch (error) {
            console.log('Error fetching user profile picture:', error);
        }
    };

    const updateProfile = async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                const userDoc = await userDocRef.get();
                if (userDoc.exists) {
                    const profilePictureUrl = userDoc.data().profilePictureUrl;
                        if(image !== null){
                            const imageRef = firebase.storage().refFromURL(profilePictureUrl);
                            await imageRef.delete();
                            await uploadImage();
                        }
                    await userDocRef.update({
                        firstname: newFirstname,
                        lastname: newLastname,
                    });
                    await fetchUserProfileData();
                    await setFirstnameInput('');
                    await setLastnameInput('');
                }
            }
            
        } catch (error) {
            console.log('Error updating user profile:', error);
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
            } else if (mode === 'camera') {
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
        } catch (error) {
            console.log(error);
        }
    };

    const uploadImage = async () => {
        if (image != null) {
            const response = await fetch(image);
            const blob = await response.blob();
            const filename = image.substring(image.lastIndexOf('/') + 1);
            const ref = firebase
                .storage()
                .ref()
                .child('images/' + firebase.auth().currentUser.uid + '/profilePicture/' + filename);
            await ref.put(blob);
            const imageUrl = await ref.getDownloadURL();
            const userDocRef = firebase
                .firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid);
            await userDocRef.update({ profilePictureUrl: imageUrl });
            try {
                await ref;
            } catch (e) {
                console.log(e);
            }
            setImage(null);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            automaticallyAdjustContentInsets={true}
            automaticallyAdjustKeyboardInsets={true}
            bounces={false}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <View style={{ paddingTop: 25 }}>
                    <Image source={{ uri: image ? image : profilePicture }} style={styles.picture} />
                    </View>
                    <Text style={styles.title}>{newFirstname} {newLastname}</Text> 
                </View>
                <View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.label}>Change profile picture</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 25 }}>
                        <View style={{ paddingRight: 15 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => pickImage('camera')}>
                                <Text style={styles.buttonText}>Camera</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingLeft: 15 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => pickImage('gallery')}>
                                <Text style={styles.buttonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Change firstname</Text> 
                    <TextInput
                        style={styles.input}
                        placeholder="New First Name"
                        autoCorrect={false}
                        placeholderTextColor="#a3a3a3"
                        value={firstnameInput}
                        onChangeText={firstnameChange}
                    />
                    <Text style={styles.label}>Change lastname</Text> 
                    <TextInput
                        style={styles.input}
                        placeholder="New Last Name"
                        autoCorrect={false}
                        placeholderTextColor="#a3a3a3"
                        value={lastnameInput}
                        onChangeText={lastnameChange}
                    />
                </View> 
                <View>                
                    <View style={{ flexDirection: 'row'}}>
                        <View style={{ paddingRight: 10 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={clear}>
                                <Text style={styles.buttonText}>Revert change</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={updateProfile}>
                                <Text style={styles.buttonText}>Apply change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{padding: 10}}>
                        <GetUserInfoBtn title="Download my data"/>
                    </View>
                </View> 
            </View>
        </ScrollView>
    );
}
