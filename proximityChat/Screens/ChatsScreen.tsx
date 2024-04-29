import React, { useEffect, useState } from 'react';
import { Appearance, View, Text, FlatList,StyleSheet } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import { firebase } from "../firebaseconfig";
import database from '@react-native-firebase/database';
import Conversation from './Conversation';

const ChatsScreen = () => {
    const [conversations,setConversations] = useState([]);

    useEffect(() => {
        fetchConversation();
      }, []);

      function fetchConversation ()
      {
        const Conversations = firebase.database()
        .ref('/conversations/-Nvg859t0oCTofwyZXGu')
        .on('value', snapshot => {
            //console.log('User data: ', snapshot.val());
            setConversations(snapshot.val());
            /*conversations.forEach(c => {
            console.log(c.conversations.messages["-NvmKMHmRxG3EEq-ktml"]);
            })
            */
            console.log({conversations});
            console.log(conversations.messages["-NvmKMHmRxG3EEq-ktml"]);
            //console.log(conversations["-Nvg859t0oCTofwyZXGu"]);
            //console.log(conversations.messages["-NvmKMHmRxG3EEq-ktml"].author.id);
          });
          
          //.currentuser
      }
  return (
    <FlatList
      data={conversations}
      style={styles.conversationItem}
      renderItem={({ item }) => (
        <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>User ID: {item.messages}</Text>
        </View>
      )}
  />
         );
};

const styles = StyleSheet.create({
  conversationItem: {
    color: 'white',
    backgroundColor: 'orange',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
});

export default ChatsScreen;

