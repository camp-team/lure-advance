import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './util';

const db = admin.firestore();

export const createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async (user, context) => {
    const eventId = context.eventId;
    const should = await shouldEventRun(eventId);
    if (should) {
      await db.doc(`users/${user.uid}`).set({
        uid: user.uid,
        email: user.email,
        avatarURL: user.photoURL,
        name: user.displayName,
        notificationCount: 0,
      });
      return markEventTried(eventId);
    } else {
      return true;
    }
  });
