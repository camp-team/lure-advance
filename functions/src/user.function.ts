import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './utils/firebase-util';
import { User } from './interfaces/user';

const db = admin.firestore();

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
      };
      await db.doc(`users/${user.uid}`).set(newUser);
      return markEventTried(eventId);
    } else {
      return true;
    }
  });
