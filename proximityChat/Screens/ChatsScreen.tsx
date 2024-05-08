import React, { useEffect, useState } from 'react';
import { Appearance, View, Text, FlatList,StyleSheet,TouchableOpacity,Modal } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import { firebase } from "../firebaseconfig";
import database from '@react-native-firebase/database';
import Conversation from './Conversation';
import { useNavigation } from '@react-navigation/native';
import ContextMenu from "react-native-context-menu-view";
import { createStackNavigator } from '@react-navigation/stack';

const ChatsScreen = (props) => {
  
    const [conversations,setConversations] = useState([]);
    const [users,setUsers] = useState([]);
    const [messages,setMessages] = useState([]);
    const navigation = useNavigation();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    useEffect(() => {
        fetchConversation();
        fetchusers();
      }, []);

      function fetchConversation() {
        const user = firebase.auth().currentUser.uid;
        
        const ConversationsRef = firebase.database().ref("users/" + user + "/conversations");
        ConversationsRef.on('value', snapshot => {
          const conversationsObj = snapshot.val();
          if (conversationsObj) { 
            const conversationsArray = Object.entries(conversationsObj).map(([key, val]) => ({
              id: key,
              ...val
            }));
            setConversations(conversationsArray); 
          } else {
            setConversations([]); 
          }
        });
      }

      function fetchusers() {
        const users = firebase.database().ref("users");
        console.log(users)
      }

      const handleLongPress = (conversationId) => {
        console.log("Rentrer");
      };
    
      const deleteConversation = (conversationId) => {
      };
      
   
   return (
      <View style={styles.container}>
        {conversations.length === 0 ? (
          <View style={styles.centeredMessage}>
            <Text>Aucune conversation en cours.</Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => {
                  navigation.navigate('Chat');
                }}
              >
                <View style={styles.conversationItem}>
                  <Text>Destinataire ID: {item.id}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
);

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    backgroundColor: '#FFFFFF', // Fond blanc
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row', // Alignement horizontal des éléments
    alignItems: 'center', // Centre verticalement les éléments
  }
});

export default ChatsScreen;

