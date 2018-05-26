import { db } from '../db';

export async function retrieveUser(username: string, source: string) {
    const usersRef = db.collection('accounts');
    const user = await usersRef.where('source', '==', source).where('username', '==', username).get();

    return user.docs[0].data().userRef;
}