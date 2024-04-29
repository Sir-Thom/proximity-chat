import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterScreen from '../Screens/RegistrationScreen';
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
    it('alert if data is empty', async () => {
        const {getByText } = render(<RegisterScreen navigation={{ navigate: jest.fn() }} />);
        const signInButton = getByText('Register');

        fireEvent.press(signInButton);

        expect(Alert.alert).toHaveBeenCalledWith('Invalid input', 'Please fill in all fields.');
    });
});