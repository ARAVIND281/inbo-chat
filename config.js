import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyD-KuBOHXtlE5HqotA-nJHtDL3Z3BOidjk",
    authDomain: "inbo-chat-a81c7.firebaseapp.com",
    databaseURL: "https://inbo-chat-a81c7.firebaseio.com",
    projectId: "inbo-chat-a81c7",
    storageBucket: "inbo-chat-a81c7.appspot.com",
    messagingSenderId: "857695110861",
    appId: "1:857695110861:web:8b0c1254d7ec73c8080b84"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();


