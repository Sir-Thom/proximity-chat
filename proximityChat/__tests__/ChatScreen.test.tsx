import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import ChatScreen from '../Screens/ChatScreen';

jest.mock('@flyerhq/react-native-chat-ui', () => {
    const lib = jest.requireActual('@flyerhq/react-native-chat-ui');

    return {
        Chat: ({t}) => (<>{t}</>),
        MessageType: lib.MessageType,
        defaultTheme: lib.defaultTheme,
        darkTheme: lib.darkTheme,
        Theme: lib.Theme,
    }
});

jest.mock('../firebaseconfig', () => ({
    firebase: {
        auth: () => ({ currentUser: { uid: 'mockUserId' } }),
        database: () => ({
            ref: () => ({
                child: () => ({
                    child: () => ({
                        child: () => ({
                            on: jest.fn((event, callback) => {
                                callback({
                                    val: () => ({
                                        messages: [],
                                    }),
                                });
                            }),
                        }),
                    }),
                }),
            }),
        })
    },
}));

describe('ChatScreen component', () => {
    it('Chat is created', async () => {
        const mockNavigate = { 
            navigate: jest.fn(),
            setOptions: jest.fn(),
            navigationOptions: jest.fn(),    
        };
        const { getByTestId } = render(<ChatScreen navigation={mockNavigate} route={{ params: { name: "name", otherUserId: "otheruserid" }}}/>);
        await waitFor(() => expect(getByTestId('chat')).toBeDefined());
    });
});