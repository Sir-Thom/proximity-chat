import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';



const firebaseConfig = {
    apiKey: "AIzaSyAQip6InT6CODYjd2YU7644mi-h2tyPZUs",

    authDomain: "proximity-chat-99d8b.firebaseapp.com",
  
    databaseURL: "https://proximity-chat-99d8b-default-rtdb.firebaseio.com",
  
    projectId: "proximity-chat-99d8b",
  
    storageBucket: "proximity-chat-99d8b.appspot.com",
  
    messagingSenderId: "578427068239",
  
    appId: "1:578427068239:web:9e835af8f165c19bd4af3a",
  
    measurementId: "G-JLXLTFEGKF"
  
};

firebase.initializeApp(firebaseConfig);

export { firebase };