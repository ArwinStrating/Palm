import * as firebase from "firebase";
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyDz3ZjOqctGGTCz-sZj_eq924vSMen2QN4",
    authDomain: "m4m-code-heroes-dev.firebaseapp.com",
    databaseURL: "https://m4m-code-heroes-dev.firebaseio.com",
    storageBucket: "m4m-code-heroes-dev.appspot.com",
    projectId: "m4m-code-heroes-dev"
};

firebase.initializeApp(config);

export const db = firebase.firestore();