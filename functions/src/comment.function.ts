import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './util';

const db = admin.firestore();

export const addReply = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}/replies/{replyId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    const thingId = context.params.thingId;
    const commentId = context.params.commentId;
    const should = await shouldEventRun(eventId);
    if (should) {
      await db
        .doc(`things/${thingId}/comments/${commentId}`)
        .update('replyCount', admin.firestore.FieldValue.increment(1));

      const value = snap.data();

      if (!value) {
        return;
      }
      const targetUid: string = value.toUid;
      const replierUid: string = value.fromUid;
      const comment: string = value.body;

      if (targetUid === replierUid) {
        return;
      }

      const docRef = db.collection(`users/${targetUid}/notifications`).doc();

      await docRef.set({
        id: docRef.id,
        type: 'reply',
        fromUid: replierUid,
        designerId: targetUid,
        thingId: thingId,
        comment: comment,
        updateAt: admin.firestore.Timestamp.now(),
      });

      await db
        .doc(`users/${targetUid}`)
        .update('notificationCount', admin.firestore.FieldValue.increment(1));

      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const deleteReply = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}/replies/{replyId}')
  .onDelete(async (snap, context) => {
    const thingId = context.params.thingId;
    const eventId = context.eventId;
    const commentId = context.params.commentId;
    const should = await shouldEventRun(eventId);
    if (should) {
      await db
        .doc(`things/${thingId}/comments/${commentId}`)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            //親のコメントが削除されたときも走るのでドキュメントがある時だけ更新する
            await doc.ref.update(
              'replyCount',
              admin.firestore.FieldValue.increment(-1)
            );
          }
        });
      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const delteComment = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}')
  .onDelete(async (snap, context) => {
    const thingId = context.params.thingId;
    const eventId = context.eventId;
    const commentId = context.params.commentId;
    const should = await shouldEventRun(eventId);
    if (should) {
      const snapShot = await db
        .collection(`things/${thingId}/comments/${commentId}/replies`)
        .get();
      console.log(snapShot);
      if (snapShot.size === 0) {
        return;
      }

      const batch = db.batch();
      snapShot.docs.forEach(async (doc) => {
        batch.delete(doc.ref);
        return await batch.commit();
      });

      return markEventTried(eventId);
    } else {
      return true;
    }
  });
