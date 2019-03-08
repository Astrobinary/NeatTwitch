import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var config = {
    apiKey: "AIzaSyDQI18hQG-MRoVqWDdgED3J0zaN684ZRa0",
    authDomain: "liveclips-2b478.firebaseapp.com",
    databaseURL: "https://liveclips-2b478.firebaseio.com",
    projectId: "liveclips-2b478",
    storageBucket: "liveclips-2b478.appspot.com",
    messagingSenderId: "757393973449"
};

firebase.initializeApp(config);

export default firebase;
