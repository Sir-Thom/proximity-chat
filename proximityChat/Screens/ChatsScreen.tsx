import React, { useEffect, useState } from 'react';
import { Appearance, View, Text, FlatList, StyleSheet } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import { firebase } from '../firebaseconfig';
import database from '@react-native-firebase/database';
import Conversation from './Conversation';

const ChatsScreen = () => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        fetchConversation();
    }, []);

    function fetchConversation() {
        const Conversations = firebase
            .database()
            .ref('/conversations')
            .on('value', (snapshot) => {
                console.log('User data: ', snapshot.val());
                setConversations(snapshot.val());
                //conversations.forEach(element => {
                //console.log({element});
                // })
                console.log({ conversations });
            });

        //.currentuser
    }
    return (
        <FlatList
            data={conversations}
            renderItem={({ item }) => (
                <Text style={styles.conversationItem}>
                    User ID: {item[0].messages[0].author.id}
                </Text>
            )}
        />
    );
};

const styles = StyleSheet.create({
    conversationItem: {
        color: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
});

export default ChatsScreen;
