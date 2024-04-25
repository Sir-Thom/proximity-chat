import { firebase } from '../firebaseconfig';

export const getUser = async () => {
    const users = await firebase.firestore().collection('users').get();
    const usersData = users.docs.map((user) => user.data());
    return usersData;
};

export const getUserFirstnameById = async (userId) => {
    const user = (await firebase.firestore().collection('users').doc(userId).get()).data()
        .firstname;
    return user;
};
