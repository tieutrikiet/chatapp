import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBxs5le0vvfY4obieMwLwk0bkNNhkw03Jc",
    authDomain: "chatapp-1512273.firebaseapp.com",
    databaseURL: "https://chatapp-1512273.firebaseio.com",
    projectId: "chatapp-1512273",
    storageBucket: "chatapp-1512273.appspot.com",
    messagingSenderId: "694397644929"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;