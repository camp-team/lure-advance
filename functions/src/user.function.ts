import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { User } from './interfaces/user';
import {
  deleteCollectionByPath,
  deleteCollectionByReference,
  markEventTried,
  shouldEventRun,
} from './utils/firebase-util';

const db = admin.firestore();
const storage = admin.storage().bucket();

export const createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async (user, context) => {
    const eventId = context.eventId;
    const should = await shouldEventRun(eventId);
    if (should) {
      const newUser: User = {
        uid: user.uid,
        email: user.email!,
        avatarURL: user.photoURL!,
        name: user.displayName!,
        notificationCount: 0,
        thingCount: 0,
        downloadCount: 0,
        likeCount: 0,
        viewCount: 0,
        commentCount: 0,
        description: '',
        weblink: '',
        createdAt: admin.firestore.Timestamp.now(),
      };
      await db.doc(`users/${user.uid}`).set(newUser);
      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const deleteAfUser = functions
  .region('asia-northeast1')
  .https.onCall((snap: User, _) => {
    console.log(`User:${snap.uid}'s Data Are Deleting.`);
    return admin.auth().deleteUser(snap.uid);
  });

export const deleteUserAccount = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete(async (user, _) => {
    const uid = user.uid;
    const myThingsRef = db.collection(`things`).where('designerId', '==', uid);
    const deleteFireStoreUser = db.doc(`users/${uid}`).delete();
    const deleleteUserStorage = storage.deleteFiles({
      directory: `users/${uid}`,
    });

    return Promise.all([
      deleteCollectionByReference(myThingsRef),
      deleteCollectionByPath(`users/${uid}/likedThings`),
      deleteCollectionByPath(`users/${uid}/notifications`),
      deleteFireStoreUser,
      deleleteUserStorage,
    ]);
  });
