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

const ChatsScreen = () => {
  
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

      const handleLongPress = (conversationId) => {
        console.log("Rentrer");
       
        // Afficher la liste déroulante avec l'option "Supprimer"
        // Lorsque l'utilisateur sélectionne "Supprimer", appelez deleteConversation(conversationId)
      };
    
      const deleteConversation = (conversationId) => {
        // Supprimer la conversation de la base de données Firebase
        // Utilisez firebase.database().ref("users/" + user + "/conversations/" + conversationId).remove();
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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Pour créer un cercle
    marginRight: 10,
  },
  conversationText: {
    flex: 1, // Utilise tout l'espace disponible
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#888888', // Couleur de texte grise
  },
});

    

export default ChatsScreen;

