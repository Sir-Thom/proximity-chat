import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import ChatScreen from '../Screens/ChatScreen';

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn()
        .mockResolvedValueOnce({ status: 'granted' }) // Simulate granted state
        .mockResolvedValueOnce({ status: 'denied' }) // Simulate denied state
        .mockResolvedValueOnce({ status: 'granted' }) 
        .mockResolvedValueOnce({ status: 'granted' }) ,


    getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 40.7128, longitude: -74.006 } }),
}));


jest.mock('../firebaseconfig', () => ({
    firebase: {
        auth: () => ({ currentUser: { uid: 'mockUserId' } }),
    },
}));

describe('MapScreen component', () => {
    it('chat is created 👍', async () => {
        const { getByTestId } = render(<ChatScreen />);
        await waitFor(() => expect(getByTestId('chat')).toBeDefined());
    });
});