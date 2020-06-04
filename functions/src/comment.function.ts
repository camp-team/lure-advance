import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './util';

const db = admin.firestore();

export const replyComment = functions
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

      await db
        .doc(`users/${targetUid}`)
        .update('notificationCount', admin.firestore.FieldValue.increment(1));

      await db.collection(`users/${targetUid}/notifications`).add({
        type: 'reply',
        fromUid: replierUid,
        designerId: targetUid,
        thingId: thingId,
        comment: comment,
        updateAt: admin.firestore.Timestamp.now(),
      });

      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const deleteComment = functions
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
        .update('replyCount', admin.firestore.FieldValue.increment(-1));
      return markEventTried(eventId);
    } else {
      return true;
    }
  });
