import React, { useEffect, useState } from 'react';
import { Appearance, View, Text, FlatList,StyleSheet } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import { firebase } from "../firebaseconfig";
import database from '@react-native-firebase/database';

const ChatsScreen = () => {
    const [conversations,setConversations] = useState([]);

    useEffect(() => {
        fetchConversation();
      }, []);

      function fetchConversation ()
      {
        const Conversations = firebase.database()
        .ref('/conversations')
        .on('value', snapshot => {
            console.log('User data: ', snapshot.val());
          });
          //.currentuser
      }
  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.conversationItem}>
          <Text>{item.title}</Text>
          {/* Add other conversation details here */}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  conversationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
});

export default ChatsScreen;

