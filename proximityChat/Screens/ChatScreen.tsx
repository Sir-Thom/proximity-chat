import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';
import React, { Children, useEffect, useState } from 'react';
import { Appearance, View } from 'react-native';

import { firebase } from '../firebaseconfig';

// type Message = MessageType.Any & {
//   parentid: string;
//   fromuserid: string;
//   touserid: string;
// }

type Conversation = {
    id: string;
    messages: MessageType.Any[];
};

export default function ChatScreen(props) {
   //console.log(props.route.params.conversation)
    //console.log(props.route.params.conversation.id)
    const { navigation } = props;
    /*useEffect(() => {
        navigation.setOptions({
            title: props.route?.params?.name ?? 'name',
        });
    }, [navigation]);
    */
    const user = { id: firebase.auth().currentUser.uid }; // TODO: user par firebase
    const user2 = { id: props?.route?.params?.otherUserId ?? 'otheruserid' }; // TODO: user par firebase
    const [conversation, setConversation] = useState<firebase.database.Reference>();
    const [messages, setMessages] = useState<MessageType.Any[]>([]); // TODO: messages par firebase

    const colorScheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    function handleSendPress(message: MessageType.PartialText) {
        const textMessage: MessageType.Text = {
            author: user,
            createdAt: Date.now(),
            id: Guid.raw(),
            text: message.text,
            type: 'text',
        };
        conversation.child('messages').push(textMessage);
    }

    async function handleImageSelection() {
        const response = (
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 0.7,
                base64: true,
            })
        ).assets?.[0];

        const imageMessage: MessageType.Image = {
            author: user,
            createdAt: Date.now(),
            height: response.height,
            id: Guid.raw(),
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
        };

        conversation.child('messages').push(imageMessage);
    }

    function handlePreviewDataFetched({
        message,
        previewData,
    }: {
        message: MessageType.Text;
        previewData: PreviewData;
    }) {
        setMessages(
            messages.map<MessageType.Any>((m) => (m.id === message.id ? { ...m, previewData } : m)),
        );
    }

    useEffect(() => {
        const customLightTheme = defaultTheme;
        customLightTheme.colors.background = '#f1f5f9';
        customLightTheme.colors.inputText = '#000000';
        customLightTheme.colors.inputBackground = '#cbd5e1';
        customLightTheme.colors.primary = '#60a5fa';
        customLightTheme.colors.secondary = '#94a3b8';

        const customDarkTheme = darkTheme;
        customDarkTheme.colors.background = '#1e293b';
        customDarkTheme.colors.inputText = '#ffffff';
        customDarkTheme.colors.inputBackground = '#334155';
        customDarkTheme.colors.primary = '#60a5fa';
        customDarkTheme.colors.secondary = '#64748b';

        setTheme(colorScheme === 'dark' ? customDarkTheme : defaultTheme);

        const customTheme = theme;
        customTheme.borders.inputBorderRadius = 20;

        setTheme(customTheme);
    }, [colorScheme]);

    useEffect(() => {
        const userRef = firebase.database().ref('users/' + user.id);
        const tempConversation = userRef.child('conversations').child(user2.id);

        setConversation(tempConversation);

        tempConversation.child('messages').on('value', (snapshot) => {
            setMessages(
                (Object.entries(snapshot.val() ?? {})
                    ?.map((x) => x[1])
                    .reverse()
                    .splice(0, 50) as MessageType.Any[]) ?? [],
            );
        });
    }, []);

    return (
        <View
            style={{height: "100%", width: "100%"}}
            testID='chat'
        >
            <Chat
                messages={messages}
                user={user}
                theme={colorScheme === 'dark' ? darkTheme : defaultTheme}
                onSendPress={handleSendPress}
                onAttachmentPress={handleImageSelection}
                onPreviewDataFetched={handlePreviewDataFetched}
                showUserAvatars
            />
        </View>
    );
}

ChatScreen.navigationOptions = ({ route }) => ({
    title: route?.params?.name ?? 'name', // Set the header title to the user name
    headerTitle: route?.params?.name ?? 'name', // Set the screen name to the user name
    backgroundColor: '#000000',
});
