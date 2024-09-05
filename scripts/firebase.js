// Firebase konfiguracija za vaš projekt
const firebaseConfig = {
    apiKey: "AIzaSyAPnZwxIr4z5RPW6468LYE7VJVMu2FREGE",
    authDomain: "zavrsni-rad-a68e6.firebaseapp.com",
    projectId: "zavrsni-rad-a68e6",
    storageBucket: "zavrsni-rad-a68e6.appspot.com",
    messagingSenderId: "634581551024",
    appId: "1:634581551024:web:b2dff073d7a5bb481df875"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
