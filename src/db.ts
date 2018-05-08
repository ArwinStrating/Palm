import * as admin from "firebase-admin";
import * as adminDup from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://m4m-code-heroes-dw.firebaseio.com"
});

export const db = admin.firestore();