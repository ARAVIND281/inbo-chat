import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBJJoz_XDodH4YMwlpuFWZVEa3AkLSOZpc",
    authDomain: "inbo-chat.firebaseapp.com",
    databaseURL: "https://inbo-chat.firebaseio.com",
    projectId: "inbo-chat",
    storageBucket: "inbo-chat.appspot.com",
    messagingSenderId: "296971932926",
    appId: "1:296971932926:web:66579d07b50acdfa9741af"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();