import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import MapScreen from '../Screens/MapScreen';
// Mocking modules
jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    getCurrentPositionAsync: jest.fn().mockResolvedValue({
        coords: { latitude: 40.7128, longitude: -74.006 },
    }),
}));

jest.mock('../utils/LocationsUtils', () => ({
    GetLocation: jest.fn().mockResolvedValue([
        { id: 1, userid: 'user1', latitude: 40.7128, longitude: -74.006 },
        { id: 2, userid: 'user2', latitude: 40.7127, longitude: -74.005 },
    ]),
    HandleLocataionUpdate: jest.fn(),
}));

jest.mock('../utils/GetUser', () => ({
    getUserFirstnameById: jest.fn().mockResolvedValue('John'),
}));

jest.mock('../firebaseconfig', () => ({
    firebase: {
        auth: jest.fn(() => ({
            currentUser: { uid: 'currentUserUid' },
        })),
    },
}));

describe('MapScreen', () => {
    test('renders map with markers', async () => {
        const { getByTestId } = render(<MapScreen navigation={{ navigate: jest.fn() }} />);

        // Wait for the map to render
        await waitFor(() => getByTestId('map'));
    });
});
