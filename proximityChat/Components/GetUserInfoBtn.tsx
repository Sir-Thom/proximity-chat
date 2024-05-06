import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    GestureResponderEvent,
    StyleSheet,
    Platform,
} from 'react-native'; 
import { getUserDataById } from '../utils/GetUser';
import { firebase } from '../firebaseconfig';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { styles } from '../Styles/AuthStyles';

const GetUserInfoBtn = (props) => {
    async function onPress(event: GestureResponderEvent): Promise<void> {
        let fileName = 'User.json';
        let mimetype = 'application/json';
        if (Platform.OS === 'android') {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const content = await getUserDataById(firebase.auth().currentUser.uid);
                await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    fileName,
                    mimetype,
                )
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, JSON.stringify(content), {
                            encoding: FileSystem.EncodingType.UTF8,
                        });
                    })
                    .catch((e) => console.error(e));
            } else {
            const content = await getUserDataById(firebase.auth().currentUser.uid);
            const localUri = FileSystem.cacheDirectory + fileName;

            await FileSystem.writeAsStringAsync(localUri, JSON.stringify(content), {
                encoding: FileSystem.EncodingType.UTF8,
            });

            Sharing.shareAsync(localUri, {
                mimeType: mimetype,
                dialogTitle: 'Download your account data',
                UTI: 'public.json',
            });
            }
        } else {
            const content = await getUserDataById(firebase.auth().currentUser.uid);
            const localUri = FileSystem.cacheDirectory + fileName;

            await FileSystem.writeAsStringAsync(localUri, JSON.stringify(content), {
                encoding: FileSystem.EncodingType.UTF8,
            });

            Sharing.shareAsync(localUri, {
                mimeType: mimetype,
                dialogTitle: 'Download your account data',
                UTI: 'public.json',
            });
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.authContainer}>
                <Text style={styles.authLink}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default GetUserInfoBtn;