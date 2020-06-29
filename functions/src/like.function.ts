import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './utils/firebase-util';
import { Notification } from './interfaces/notification';

const db = admin.firestore();

export const likeThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/likeUsers/{uid}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    const thingId = context.params.thingId;
    const should = await shouldEventRun(eventId);
    if (should) {
      await db
        .doc(`things/${thingId}`)
        .update('likeCount', admin.firestore.FieldValue.increment(1));

      const value = snap.data();
      if (!value) {
        console.log('Data is Empty.');
        return;
      }
      const targetUid: string = value.designerId;
      const likerUid: string = context.params.uid;

      await db.doc(`users/${targetUid}/likedThings/${thingId}`).set({
        thingId,
      });

      if (targetUid === likerUid) {
        console.log('My Thing is Liked.');
        return;
      }

      const docRef = db.collection(`users/${targetUid}/notifications`).doc();

      const notification: Notification = {
        id: docRef.id,
        type: 'like',
        fromUid: likerUid,
        toUid: targetUid,
        thingId: thingId,
        comment: '',
        updateAt: admin.firestore.Timestamp.now(),
      };

      await docRef.set(notification);

      await db
        .doc(`users/${targetUid}`)
        .update('notificationCount', admin.firestore.FieldValue.increment(1));

      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const unLikeThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/likeUsers/{uid}')
  .onDelete(async (snap, context) => {
    const eventId = context.eventId;
    const should = await shouldEventRun(eventId);
    const thingId = context.params.thingId;
    const value = snap.data();
    const targetUid: string = value.designerId;
    if (should) {
      await db.doc(`users/${targetUid}/likedThings/${thingId}`).delete();

      const snapShot = await db.doc(`things/${context.params.thingId}`).get();
      if (snapShot.exists) {
        await snapShot.ref.update(
          'likeCount',
          admin.firestore.FieldValue.increment(-1)
        );
      }

      return markEventTried(eventId);
    } else {
      return true;
    }
  });
