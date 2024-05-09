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
import { createStackNavigator } from '@react-navigation/stack';

const ChatsScreen = (props) => {
  
    const [conversations,setConversations] = useState([]);
    const [users,setUsers] = useState([]);
    const [messages,setMessages] = useState([]);
    const navigation = useNavigation();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userFullNames, setUserFullNames] = useState({});

    useEffect(() => {
      fetchConversation();
    }, []);
  
    useEffect(() => {
      // Cette fonction est appelée chaque fois que `conversations` change.
      const fetchUserNames = async () => {
        const names = {};
        for (const conversation of conversations) {
          const userData = await getUserFullNameByUid(conversation.id);
          if (userData) {
            names[conversation.id] = `${userData.firstname} ${userData.lastname}`;
          }
        }
        setUserFullNames(names);
      };
  
      fetchUserNames();
    }, [conversations]);

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
            //console.log(conversations);
            //getUserFullNameByUid();
            //getOtherUserName();
          } else {
            setConversations([]); 
          }
        });
      }

      const getOtherUserName = async () => {
        const users = await firebase.firestore().collection('users').get();
        const usersData = users.docs.map((user) => user.data());
        return usersData;
    };

    const getUserFullNameByUid = async (uid) => {
      const userDoc = await firebase.firestore().collection('users').doc("fFV1XrTc9jYOlyEyeZ7jSUpxto73").get();
      if (userDoc.exists) {
          const userData = userDoc.data();
          const { firstname, lastname } = userData;
          console.log(firstname, lastname);
          return { firstname, lastname };
      } else {
          // Gérer le cas où l'utilisateur n'existe pas
          console.log('Aucun utilisateur trouvé avec cet uid');
          return null; // Ou une autre valeur appropriée pour indiquer l'absence d'utilisateur
      }
  };

  /*
    const getUserFirstNameByUid = async () => {
      const userDoc = await firebase.firestore().collection('users').doc("fFV1XrTc9jYOlyEyeZ7jSUpxto73").get();
      if (userDoc.exists) {
        console.log(userDoc.data().firstname);
          return userDoc.data().firstname;
      } else {
          // Gérer le cas où l'utilisateur n'existe pas
          console.log('Aucun utilisateur trouvé avec cet uid');
      }
  };
  */
  

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
              navigation.navigate('Chat', { conversation: item });
            }}
          >
            <View style={styles.conversationItem}>
              <Text>Conversation avec : {userFullNames[item.id]}</Text>
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
    borderBottomColor: '#E0E0E0', // Couleur plus douce pour la séparation
    paddingVertical: 15, // Un peu plus d'espace vertical pour l'aération
    paddingHorizontal: 20, // Un peu plus d'espace horizontal pour l'aération
    flexDirection: 'row', // Alignement horizontal des éléments
    alignItems: 'center', // Centre verticalement les éléments
    // Ajout d'une ombre pour un effet de profondeur
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    // Arrondir les coins de l'élément
    borderRadius: 10,
    // Ajout d'une marge pour séparer les éléments de la liste
    marginVertical: 5,
    marginHorizontal: 10,
  },
});

export default ChatsScreen;

