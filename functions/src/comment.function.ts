import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  shouldEventRun,
  markEventTried,
  deleteCollection,
} from './utils/firebase-util';
import { Notification } from './interfaces/notification';

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

      await db
        .doc(`things/${thingId}`)
        .update('commentCount', admin.firestore.FieldValue.increment(1));

      const value = snap.data();
      const targetUid: string = value.toUid;
      const replierUid: string = value.fromUid;
      const comment: string = value.body;

      if (targetUid === replierUid) {
        console.log('');
        return;
      }

      const docRef = db.collection(`users/${targetUid}/notifications`).doc();

      const notification: Notification = {
        id: docRef.id,
        type: 'reply',
        fromUid: replierUid,
        toUid: targetUid,
        thingId: thingId,
        comment: comment,
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

export const deleteReply = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}/replies/{replyId}')
  .onDelete(async (snap, context) => {
    const thingId = context.params.thingId;
    const eventId = context.eventId;
    const commentId = context.params.commentId;
    const should = await shouldEventRun(eventId);
    if (should) {
      const commentSnap = await db.doc(`things/${thingId}`).get();
      if (commentSnap.exists) {
        await commentSnap.ref.update(
          'commentCount',
          admin.firestore.FieldValue.increment(-1)
        );
      } else {
        console.log('Thing or ParentComment Deleted.');
      }

      const replySnap = await db
        .doc(`things/${thingId}/comments/${commentId}`)
        .get();

      if (replySnap.exists) {
        await replySnap.ref.update(
          'replyCount',
          admin.firestore.FieldValue.increment(-1)
        );
      } else {
        console.log('Thing or ParentComment Deleted.');
      }

      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const addComment = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}')
  .onCreate(async (snap, context) => {
    const thingId = context.params.thingId;
    const eventId = context.eventId;
    const should = await shouldEventRun(eventId);
    if (should) {
      await db
        .doc(`things/${thingId}`)
        .update('commentCount', admin.firestore.FieldValue.increment(1));

      return markEventTried(eventId);
    } else {
      return true;
    }
  });

export const deleteComment = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}')
  .onDelete(async (snap, context) => {
    const thingId = context.params.thingId;
    const eventId = context.eventId;
    const commentId = context.params.commentId;
    const should = await shouldEventRun(eventId);
    if (should) {
      const snapShot = await db.doc(`things/${thingId}`).get();
      if (snapShot.exists) {
        await snapShot.ref.update(
          'commentCount',
          admin.firestore.FieldValue.increment(-1)
        );
      }

      const path: string = `things/${thingId}/comments/${commentId}/replies`;
      await deleteCollection(path);

      return markEventTried(eventId);
    } else {
      return true;
    }
  });
