import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './util';

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
        return;
      }
      const targetUid: string = value.designerId;
      const likerUid: string = context.params.uid;

      await db
        .doc(`users/${targetUid}`)
        .update('notificationCount', admin.firestore.FieldValue.increment(1));

      await db.collection(`users/${targetUid}/notifications`).add({
        type: 'like',
        fromUid: likerUid,
        designerId: targetUid,
        thingId: thingId,
        thumbnailUrl: value.thumbnailUrl,
        comment: '',
        avatarUrl: value.avatarUrl,
        name: value.name,
        updateAt: admin.firestore.Timestamp.now(),
      });

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
    if (should) {
      await db
        .doc(`things/${context.params.thingId}`)
        .update('likeCount', admin.firestore.FieldValue.increment(-1));
      return markEventTried(eventId);
    } else {
      return true;
    }
  });