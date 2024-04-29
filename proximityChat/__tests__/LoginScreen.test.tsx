import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../Screens/LoginScreen';

jest.mock('../firebaseconfig', () => ({
    firebase: {
    auth: jest.fn(() => ({
        signInWithEmailAndPassword: jest.fn(),
    })),
    },
}));

describe('LoginScreen', () => {
    it('alert if data is empty', async () => {
        const {getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
        const signInButton = getByText('Sign in');

        fireEvent.press(signInButton);
    });
});
