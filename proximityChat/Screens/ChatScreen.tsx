import React, { useEffect, useState } from 'react';
import { Appearance, View } from 'react-native';
import { Chat, MessageType, defaultTheme, darkTheme, Theme } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Guid from 'guid';

export default function ChatScreen(props) {
  const { navigation } = props;
  useEffect(() => {
      navigation.setOptions({
          title: props.route.params.name,
      });
  }, [navigation]);
  const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' } // TODO: user par firebase
  const user2 = { id: '06c33e8b-e835-4736-80f4-63f34b66666c' } // TODO: user par firebase
  const [messages, setMessages] = useState<MessageType.Any[]>([
    {
      author: user2,
      createdAt: Date.now(),
      id: Guid.raw(),
      text: 'test',
      type: 'text',
    }

  ]) // TODO: messages par firebase

  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  function addMessage(message: MessageType.Any) {
    setMessages([message, ...messages]);
  }

  function handleSendPress(message: MessageType.PartialText) {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: Guid.raw(),
      text: message.text,
      type: 'text',
    }
    addMessage(textMessage)
  }

  async function handleImageSelection() {
    let response = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
      base64: true
    })).assets?.[0];

    let imageMessage: MessageType.Image = {
      author: user,
      createdAt: Date.now(),
      height: response.height,
      id: Guid.raw(),
      name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
      size: response.fileSize ?? 0,
      type: 'image',
      uri: `data:image/*;base64,${response.base64}`,
      width: response.width,
    }

    addMessage(imageMessage);
  }

  function handlePreviewDataFetched({
    message,
    previewData,
  }: {
    message: MessageType.Text
    previewData: PreviewData
  }) {
    setMessages(
      messages.map<MessageType.Any>((m) =>
        m.id === message.id ? { ...m, previewData } : m
      )
    )
  }

  useEffect(() => {
    let customLightTheme = defaultTheme;
    customLightTheme.colors.background = '#f1f5f9';
    customLightTheme.colors.inputText = '#000000';
    customLightTheme.colors.inputBackground = '#cbd5e1';
    customLightTheme.colors.primary = '#60a5fa';
    customLightTheme.colors.secondary = '#94a3b8';

    let customDarkTheme = darkTheme;
    customDarkTheme.colors.background = '#1e293b';
    customDarkTheme.colors.inputText = '#ffffff';
    customDarkTheme.colors.inputBackground = '#334155';
    customDarkTheme.colors.primary = '#60a5fa';
    customDarkTheme.colors.secondary = '#64748b';
    
    setTheme(colorScheme === 'dark' ? customDarkTheme : defaultTheme)
  }, [colorScheme])

  return (
    <SafeAreaProvider style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ height: '97%', width: '95%', margin: 'auto', borderRadius: 20, overflow: 'hidden' }}>
      <Chat
        messages={messages}
        user={user}
        theme={colorScheme === 'dark' ? darkTheme : defaultTheme}
        onSendPress={handleSendPress}
        onAttachmentPress={handleImageSelection}
        onPreviewDataFetched={handlePreviewDataFetched}
        />
      </View>
    </SafeAreaProvider>
  )
}
ChatScreen.navigationOptions = ({ route }) => ({
  title: route.params.name, // Set the header title to the user name
  headerTitle: route.params.name, // Set the screen name to the user name
  headerStyle: {
      backgroundColor: '#f4511e',
    },
});
