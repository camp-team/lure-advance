import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Notification } from './interfaces/notification';
import {
  deleteCollectionByPath,
  markEventTried,
  shouldEventRun,
} from './utils/firebase-util';

const db = admin.firestore();

export const addReply = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}/comments/{commentId}/replies/{replyId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    const thingId = context.params.thingId;
    const commentId = context.params.commentId;
    const value = snap.data();

    const should = await shouldEventRun(eventId);
    if (should) {
      await db
        .doc(`things/${thingId}/comments/${commentId}`)
        .update('replyCount', admin.firestore.FieldValue.increment(1));

      const thingDoc = await db.doc(`things/${thingId}`).get();

      if (thingDoc.exists) {
        await thingDoc.ref.update(
          'commentCount',
          admin.firestore.FieldValue.increment(1)
        );
        await db
          .doc(`users/${value.designerId}`)
          .update('commentCount', admin.firestore.FieldValue.increment(1));
      } else {
        console.log(`Thing:${thingId} does not exist.`);
      }

      const targetUid: string = value.toUid;
      const replierUid: string = value.fromUid;
      const commentBody: string = value.body;

      if (targetUid === replierUid) {
        console.log(`User:${targetUid} Reply to My Comment.`);
        return;
      }

      const docRef = db.collection(`users/${targetUid}/notifications`).doc();

      const notification: Notification = {
        id: docRef.id,
        type: 'reply',
        fromUid: replierUid,
        toUid: targetUid,
        thingId: thingId,
        commentBody: commentBody,
        commentId: commentId,
        updateAt: admin.firestore.Timestamp.now(),
      };

      await docRef.set(notification);

      const userSnapShot = await db.doc(`users/${targetUid}`).get();

      if (userSnapShot.exists) {
        await userSnapShot.ref.update(
          'notificationCount',
          admin.firestore.FieldValue.increment(1)
        );
      } else {
        console.log(`User:${targetUid} does not exsit.`);
      }

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
    const value = snap.data();
    if (should) {
      const commentSnap = await db.doc(`things/${thingId}`).get();
      if (commentSnap.exists) {
        await commentSnap.ref.update(
          'commentCount',
          admin.firestore.FieldValue.increment(-1)
        );
        await db
          .doc(`users/${value.designerId}`)
          .update('commentCount', admin.firestore.FieldValue.increment(-1));
      } else {
        console.log('Thing or Parent Comment is Deleted.');
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
        console.log('Thing or Parent Comment is Deleted.');
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
    const value = snap.data();
    if (should) {
      const thingDoc = await db.doc(`things/${thingId}`).get();
      if (thingDoc.exists) {
        await thingDoc.ref.update(
          'commentCount',
          admin.firestore.FieldValue.increment(1)
        );
        await db
          .doc(`users/${value.designerId}`)
          .update('commentCount', admin.firestore.FieldValue.increment(1));
        console.log('Increment CommentCount.');
      } else {
        console.log('thing does not exsists.');
      }
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
    const value = snap.data();
    if (should) {
      const snapShot = await db.doc(`things/${thingId}`).get();
      if (snapShot.exists) {
        await snapShot.ref.update(
          'commentCount',
          admin.firestore.FieldValue.increment(-1)
        );
        await db
          .doc(`users/${value.designerId}`)
          .update('commentCount', admin.firestore.FieldValue.increment(1));
        console.log('Decrement Comment Count.');
      } else {
        console.log('Comment does not exist. Thing is Deleted.');
      }

      const path: string = `things/${thingId}/comments/${commentId}/replies`;
      await deleteCollectionByPath(path);
      console.log('Deleting Comments were Successful');

      return markEventTried(eventId);
    } else {
      return true;
    }
  });
