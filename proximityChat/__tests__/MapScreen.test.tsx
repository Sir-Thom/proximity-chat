import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import MapScreen, { calculateDistance } from '../Screens/MapScreen';

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest
        .fn()
        .mockResolvedValueOnce({ status: 'granted' }) // Simulate granted state
        .mockResolvedValueOnce({ status: 'denied' }) // Simulate denied state
        .mockResolvedValueOnce({ status: 'granted' })
        .mockResolvedValueOnce({ status: 'granted' }),

    getCurrentPositionAsync: jest
        .fn()
        .mockResolvedValue({ coords: { latitude: 40.7128, longitude: -74.006 } }),
}));

jest.mock('../firebaseconfig', () => ({
    firebase: {
        auth: () => ({ currentUser: { uid: 'mockUserId' } }),
    },
}));

jest.mock('../utils/GetUser', () => ({
    getUserFirstnameById: jest.fn().mockResolvedValue('MockFirstName'),
}));
import { getUserFirstnameById } from '../utils/GetUser';
jest.mock('../utils/GetUser', () => ({
    getUserFirstnameById: jest.fn().mockResolvedValue('MockFirstName'),
}));

jest.mock('../utils/LocationsUtils', () => ({
    GetLocation: jest.fn().mockResolvedValue([
        { id: 1, userid: 'mockUserId', latitude: 40.7128, longitude: -74.006 },
        { id: 2, userid: 'mockUserId2', latitude: 40.713, longitude: -74.005 },
        { id: 3, userid: 'mockUserId3', latitude: 40.715, longitude: -74.008 }, // Outside detection radius
    ]),
    HandleLocataionUpdate: jest.fn(),
}));

describe('MapScreen component', () => {
    it('requests location permission and sets userLocation when permission is granted', async () => {
        const { getByTestId } = render(<MapScreen navigation={'Chat'} />);
        await waitFor(() => expect(getByTestId('map')).toBeDefined());
        // Expectation: Location permission is granted
        expect(getByTestId('map')).toBeTruthy();
    });

    it('displays an alert when location permission is denied', async () => {
        const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

        const { getByTestId } = render(<MapScreen navigation={undefined} />);

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalled();
            expect(mockAlert).toHaveBeenCalledWith('Permission to access location was denied');
        });
    });

    it('calculates distance correctly for known inputs', () => {
        const distance1 = calculateDistance(40.7128, -74.006, 40.7128, -74.0061);
        expect(distance1).toBeCloseTo(0.0084, 4);

        const distance2 = calculateDistance(40.7128, -74.006, 40.715, -74.008);
        expect(distance2).toBeCloseTo(0.2971, 4); // Updated expected value
    });

    it('renders correctly', async () => {
        const { getByTestId } = render(<MapScreen navigation={'Chat'} />);
        await waitFor(() => expect(getByTestId('map')).toBeDefined());
        expect(getByTestId('map')).toBeTruthy();
    });

    it('navigate to Chat', async () => {
        const mockNavigate = jest.fn();
        const { getAllByTestId } = render(<MapScreen navigation={{ navigate: mockNavigate }} />);
        await waitFor(() => expect(getAllByTestId('marker')).toBeDefined());

        fireEvent.press(getAllByTestId('marker')[0]); // Assuming you have a testID for your Marker component

        await waitFor(() => {
            expect(getUserFirstnameById).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('Chat', { name: 'MockFirstName' });
        });
    });
});
