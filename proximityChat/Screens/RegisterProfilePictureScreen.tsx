import React, { useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-manipulator';
import { styles } from '../Styles/AuthStyles';

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
        });    
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const cropImage = async () => {
        if (!image) return;    
        const cropResult = await ImageManipulator.manipulateAsync(
            image,
            [{ crop: { originX: 0, originY: 0, width: 100, height: 100 } }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );    
            setImage(cropResult.uri);
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
                        <Image source={{ uri: image }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={pickImage}
                        >
                            <Text style={styles.buttonText}>Upload</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={cropImage}
                        >
                            <Text style={styles.buttonText}>Crop</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>First Name: {firstname}</Text>
                    <Text>Last Name: {lastname}</Text>
                    <Text>Email: {email}</Text>
                    <Text>Password: {password}</Text>
                </View>
        </ScrollView>
    );
};

