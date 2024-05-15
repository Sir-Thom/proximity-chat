import React, { useEffect, useState } from 'react';
import { Appearance, View, Text, FlatList,StyleSheet,TouchableOpacity,Modal } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import { firebase } from "../firebaseconfig";
import database from '@react-native-firebase/database';
import Conversation from './ConversationScreen';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getUser } from '../utils/GetUser';
const ChatsScreen = (props) => {
  
    const [conversations,setConversations] = useState([]);
    const [users,setUsers] = useState([]);
    const [messages,setMessages] = useState([]);
    const navigation = useNavigation();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userFullNames, setUserFullNames] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [firstname, setFirstname] = useState(null);

    useEffect(() => {
      fetchConversation();
    }, []);
  
    useEffect(() => {
     
      // Cette fonction est appelée chaque fois que `conversations` change.
      const fetchUserNames = async () => {
        const names = {};
        const firstName = {};
        for (const conversation of conversations) {
          const userData = await getUserFullNameByUid(conversation.id);
          const userFirstName = await getUserFirstNameByUid(conversation.id);
          if (userData) {
            names[conversation.id] = `${userData.firstname} ${userData.lastname}`;
            firstName[conversation.id] = `${userData.firstname}`;
          }
        }
        setFirstname(firstName);
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
    const getUserFirstNameByUid = async (uid) => {
      const userDoc = await firebase.firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
          const userData = userDoc.data();
          const { firstname } = userData;
          return firstname;
      } else {
          console.log('Aucun utilisateur trouvé avec cet uid');
          return null;
      }
    };

    const getUserFullNameByUid = async (uid) => {
      const userDoc = await firebase.firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
          const userData = userDoc.data();
          setUsers();
          const { firstname, lastname } = userData;
          console.log(firstname, lastname);
          return { firstname, lastname };
      } else {
          console.log('Aucun utilisateur trouvé avec cet uid');
          return null;
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
        setSelectedConversationId(conversationId);
        setModalVisible(true);
      };
  
    
      const deleteConversation = async () => {
        // Assurez-vous que selectedConversationId n'est pas null
        if (selectedConversationId) {
          try {
            await firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/conversations/" + selectedConversationId).remove();
            setModalVisible(false); // Fermer le modal après la suppression
          } catch (error) {
            console.error("Erreur lors de la suppression de la conversation :", error);
          }
        }
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
              
              navigation.navigate('Conversation', { name:firstname[item.id],conversation: item });
            }}
          >
            <View style={styles.conversationItem}>
              <Text>Conversation avec : {userFullNames[item.id]}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    )}
    <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(!modalVisible);
  }}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer cette conversation ?</Text>
      <TouchableOpacity
        style={styles.buttonClose}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text style={styles.textStyle}>Annuler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonDelete}
        onPress={deleteConversation}
      >
        <Text style={styles.textStyle}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonDelete: {
    backgroundColor: "#FF0000",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default ChatsScreen;

