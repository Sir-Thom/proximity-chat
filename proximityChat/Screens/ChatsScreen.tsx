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
    const [messages,setMessages] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchConversation();
      }, []);

      function fetchConversation() {
        const user = firebase.auth().currentUser.uid;
        const ConversationsRef = firebase.database().ref("users/" + user + "/conversations");
        ConversationsRef.on('value', snapshot => {
          const conversationsObj = snapshot.val();
          const conversationsArray = Object.entries(conversationsObj).map(([key, val]) => ({
            id: key,
            ...val
          }));
          setConversations(conversationsArray);
          console.log(conversationsArray)
        });
      }
     
      return (
        <View>
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  // Naviguez vers ChatScreen avec les données de la conversation
                  navigation.navigate('ChatScreen', { conversation: item });
                }}
              >
                <View style={styles.conversationItem}>
                  <Text>Destinataire ID: {item.id}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    };

    const styles = StyleSheet.create({
      conversationItem: {
        backgroundColor: '#F5F5F5', // Couleur de fond légère
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', // Couleur de la ligne de séparation
        paddingVertical: 10, // Espacement vertical
        paddingHorizontal: 16, // Espacement horizontal
      },
    });
    

export default ChatsScreen;

