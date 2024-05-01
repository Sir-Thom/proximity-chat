import * as Location from 'expo-location';

import { firebase } from '../firebaseconfig';

export async function StoreLocation(latitude: number, longitude: number) {
    try {
        const locationref = firebase.database().ref('locations');

        if (firebase.auth().currentUser.uid) {
            const snapshot = await locationref
                .orderByChild('userid')
                .equalTo(firebase.auth().currentUser.uid)
                .once('value');
            if (snapshot.val()) {
                snapshot.forEach((child) => {
                    locationref.child(child.key).update({
                        latitude,
                        longitude,
                    });
                });
            } else {
                await locationref.push({
                    userid: firebase.auth().currentUser.uid,
                    latitude,
                    longitude,
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export async function GetLocation() {
    try {
        const locationref = firebase.database().ref('locations');
        const snapshot = await locationref.once('value');
        const locations = snapshot.val();

        // Filter out the current user's location
        const currentUserUid = firebase.auth().currentUser.uid;
        if (currentUserUid == undefined || null){
          
        }
        const filteredLocations = Object.values(locations).filter(
            (location) => location !== currentUserUid,
        );

        return filteredLocations;
    } catch (error) {
        console.log(error);
    }
}

export async function GetLocationByUser(userId: string) {
    try {
        const locationref = firebase.database().ref('locations');
        const snapshot = await locationref.orderByChild('userid').equalTo(userId).once('value');
        return snapshot.val();
    } catch (error) {
        console.log(error);
    }
}

export async function HandleLocataionUpdate() {
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    StoreLocation(latitude, longitude);
}
