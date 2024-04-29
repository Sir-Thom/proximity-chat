import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../Screens/LoginScreen';
import { Alert } from 'react-native';

jest.mock('../firebaseconfig', () => ({
    firebase: {
    auth: jest.fn(() => ({
        signInWithEmailAndPassword: jest.fn(),
    })),
    },
}));

jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
}));

describe('LoginScreen', () => {
    it('alert if email or password is empty', async () => {
        const {getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
        const signInButton = getByText('Sign in');

        fireEvent.press(signInButton);

        expect(Alert.alert).toHaveBeenCalledWith('Invalid input', 'Please fill in all fields.');
    });
});
