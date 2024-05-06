import React, { useEffect, useState } from 'react';
import { Appearance, View, Text, FlatList,StyleSheet,TouchableOpacity } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import { firebase } from "../firebaseconfig";
import database from '@react-native-firebase/database';
import Conversation from './Conversation';
import { useNavigation } from '@react-navigation/native';

const ChatsScreen = () => {
  
    const [conversations,setConversations] = useState([]);
    const [users,setUsers] = useState([]);
    const [messages,setMessages] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchConversation();
        fetchusers();
      }, []);

      function fetchConversation() {
        const user = firebase.auth().currentUser.uid;
        
        const ConversationsRef = firebase.database().ref("users/" + user + "/conversations");
        ConversationsRef.on('value', snapshot => {
          const conversationsObj = snapshot.val();
          if (conversationsObj) { // Vérifiez si l'objet n'est pas null
            const conversationsArray = Object.entries(conversationsObj).map(([key, val]) => ({
              id: key,
              ...val
            }));
            setConversations(conversationsArray); // Mettez à jour l'état avec le nouveau tableau
          } else {
            setConversations([]); // Mettez à jour l'état avec un tableau vide si aucun objet de conversation n'est trouvé
          }
        });
      }

      function fetchusers() {
        //Aller chercher tous les user pour afficher au lieu de leur UID
        //Sois via realtime et la modifier ou y aller 
        const users = firebase.database().ref("users");
        console.log(users)
      }
      
   
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
            onPress={() => {
              navigation.navigate('ChatScreen', { conversation: item });
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
    flex: 1, // Utilisez tout l'espace disponible
  },
  centeredMessage: {
    flex: 1, // Utilisez tout l'espace disponible
    justifyContent: 'center', // Centre verticalement
    alignItems: 'center', // Centre horizontalement
  },
  conversationItem: {
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

    

export default ChatsScreen;

