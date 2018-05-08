import * as admin from "firebase-admin";
import * as adminDup from "firebase-admin";

const serviceAccount = require('../config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://m4m-code-heroes-dw.firebaseio.com"
});

export const db = admin.firestore();