import { StyleSheet, View, Text, Pressable } from "react-native";
import ChatScreen from "./ChatScreen";

/*function fetchMessages ()
      {
        const Conversations = firebase.database()
        .ref('/conversations')
        .on('value', snapshot => {
            console.log('User data: ', snapshot.val());
            setConversations(snapshot.val());
            //conversations.forEach(element => {
            //console.log({element});
           // })
            console.log({conversations});
          });
          
          //.currentuser
      }
*/
export default function Conversation(props){
    return (
        // mettre el onPress={return: <ChatScreen />}
        <Pressable onPress={this.props.onPress}>
        {<ChatScreen />}
            <View style = {styles.todoItem}>
                <Text style = {styles.todoText}>{props.text}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    todoItem:{
        flex: 1,
        padding: 24,
        backgroundColor: '#eaeaea',
    },
    todoText:{
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: 'white',
        borderRadius: 6,
        backgroundColor: '#61dafb',
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    }
});