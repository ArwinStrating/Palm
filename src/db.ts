import * as admin from "firebase-admin";
import * as adminDup from "firebase-admin";

require('dotenv').config();

// var config = {
//     "apiKey": "AIzaSyDm67BHbyWAIo-BYE5xcpkj97iji6m6dvU",
//     "authDomain": "m4m-code-heroes-dw.firebaseapp.com",
//     "databaseURL": "https://m4m-code-heroes-dw.firebaseio.com",
//     "projectId": "m4m-code-heroes-dw",
//     "storageBucket": "m4m-code-heroes-dw.appspot.com",
//     "messagingSenderId": "281814238847"
// }

// const serviceAccount = require(process.env.SERVICE_ACCOUNT);
const serviceAccount = require('../src/config.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://m4m-code-heroes-dw.firebaseio.com"
// });

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://m4m-code-heroes-dw.firebaseio.com"
});

export const db = admin.firestore();