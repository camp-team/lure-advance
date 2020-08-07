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
      const thingSnapShot = await db.doc(`things/${thingId}`).get();

      if (thingSnapShot.exists) {
        await thingSnapShot.ref.update(
          'likeCount',
          admin.firestore.FieldValue.increment(1)
        );
      } else {
        functions.logger.info(`Thing ${thingId} does not exsit.`);
      }

      const value = snap.data();
      const targetUid: string = value.designerId;
      const likerUid: string = context.params.uid;

      await db.doc(`users/${targetUid}/likedThings/${thingId}`).set({
        thingId,
      });

      const useSnapShot = await db.doc(`users/${targetUid}`).get();
      if (useSnapShot.exists) {
        await useSnapShot.ref.update(
          'likeCount',
          admin.firestore.FieldValue.increment(1)
        );
        functions.logger.info('Increment LikeCount.');
      } else {
        functions.logger.info(`User:${targetUid} does not exsit.`);
      }

      if (targetUid === likerUid) {
        functions.logger.info(`User:${likerUid} like my thing.`);
        functions.logger.info(`Function is completed.`);
        return;
      }

      const docRef = db.collection(`users/${targetUid}/notifications`).doc();

      const notification: Notification = {
        id: docRef.id,
        type: 'like',
        fromUid: likerUid,
        toUid: targetUid,
        thingId: thingId,
        commentBody: '',
        commentId: '',
        updateAt: admin.firestore.Timestamp.now(),
      };
      await docRef.set(notification);

      const notificationSnapShot = await db.doc(`users/${targetUid}`).get();

      if (notificationSnapShot.exists) {
        await notificationSnapShot.ref.update(
          'notificationCount',
          admin.firestore.FieldValue.increment(1)
        );
        functions.logger.info('Decrement NotificationCount.');
      } else {
        functions.logger.info(
          `User:${targetUid}'s notification does not exsit.`
        );
      }

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
        await db
          .doc(`users/${targetUid}`)
          .update('likeCount', admin.firestore.FieldValue.increment(-1));
        functions.logger.info('Decrement LikeCount.');
      } else {
        functions.logger.info(`User:${targetUid} does not exist.`);
      }

      return markEventTried(eventId);
    } else {
      return true;
    }
  });
