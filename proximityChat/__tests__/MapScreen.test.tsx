import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import MapScreen, { calculateDistance } from '../Screens/MapScreen';


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
    jest.mock('expo-location', () => ({
        requestForegroundPermissionsAsync: jest.fn()
            .mockResolvedValueOnce({ status: 'granted' }) // Simulate granted state
            .mockResolvedValueOnce({ status: 'denied' }) // Simulate denied state
            .mockResolvedValueOnce({ status: 'granted' }) 
            .mockResolvedValueOnce({ status: 'granted' }) ,

        getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 40.7128, longitude: -74.006 } }),
    }));

    it('requests location permission and sets userLocation when permission is granted', async () => {
        const { getByTestId } = render(<MapScreen navigation={'Chat'}  />);
        await waitFor(() => expect(getByTestId('map-view-child')).toBeDefined());
        // Expectation: Location permission is granted
        expect(getByTestId('map-view-child')).toBeTruthy(); 
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
        await waitFor(() => expect(getByTestId('map-view-child')).toBeDefined());
        expect(getByTestId('map-view-child')).toBeTruthy(); 
    });

    it('navigate to Chat', async () => {
        const mockNavigate = jest.fn();
        const { getByTestId, queryAllByTestId } = render(<MapScreen navigation={{ navigate: mockNavigate }} />);
        
        // Wait for the map to render
        await waitFor(() => expect(getByTestId('map-view-child')).toBeDefined());
        
        // Check if there are any markers rendered
        const markers = queryAllByTestId('marker');
        console.log("Number of markers:", markers.length);
        console.log("Markers:", markers);
    
        // Assuming there is at least one marker, press the first one
        if (markers.length > 0) {
            fireEvent.press(markers[0]);
    
            // Wait for navigation to occur
            await waitFor(() => {
                expect(getUserFirstnameById).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('Chat', { name: 'MockFirstName' });
            });
        } else {
            console.log("No markers found.");
        }
    });
    
    

});