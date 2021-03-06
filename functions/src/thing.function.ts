import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Thing } from './interfaces/thing';
import { Algolia } from './utils/algolia-util';
import { deleteCollectionByPath } from './utils/firebase-util';

const storage = admin.storage().bucket();
const algolia = new Algolia();
const db = admin.firestore();

export const addThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const thingId = context.params.thingId;
    const designerId = data.designerId;

    await db
      .doc(`users/${designerId}/mythings/${thingId}`)
      .set({ thingId: thingId });

    const userSnapShot = await db.doc(`users/${designerId}`).get();
    if (userSnapShot.exists) {
      await userSnapShot.ref.update(
        'thingCount',
        admin.firestore.FieldValue.increment(1)
      );
    } else {
      functions.logger.info(`User:${designerId} does not exist.`);
    }

    return algolia.saveRecord({
      indexName: 'things',
      largeConcentKey: 'description',
      data,
    });
  });

export const updateThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}')
  .onUpdate(async (snap, context) => {
    const data = snap.after.data();
    return algolia.saveRecord({
      indexName: 'things',
      largeConcentKey: 'description',
      isUpdate: true,
      data,
    });
  });

export const deleteThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}')
  .onDelete(async (snap, context) => {
    const thingId = context.params.thingId;
    const data = snap.data();
    const designerId = data.designerId;

    await db.doc(`users/${designerId}/mythings/${thingId}`).delete();
    const snapShot = await db.doc(`users/${designerId}`).get();

    if (snapShot.exists) {
      await snapShot.ref.update(
        'thingCount',
        admin.firestore.FieldValue.increment(-1)
      );
      functions.logger.info('Increment Thing Count.');
    } else {
      functions.logger.info(`Thing ${thingId} does not exsist.`);
    }

    await algolia.removeRecord('things', thingId);

    return Promise.all([
      deleteCollectionByPath(`things/${thingId}/likeUsers`),
      deleteCollectionByPath(`things/${thingId}/comments`),
      deleteCollectionByPath(`things/${thingId}/stls`),
      storage.deleteFiles({
        directory: `things/${thingId}`,
      }),
    ]);
  });

export const incrementViewCount = functions
  .region('asia-northeast1')
  .https.onCall(async (snap: Thing) => {
    if (snap === null) {
      functions.logger.info('Snap is null.');
      return;
    }
    const thingSnapShot = await db.doc(`things/${snap.id}`).get();
    if (thingSnapShot.exists) {
      const updateThingViewCount = thingSnapShot.ref.update(
        'viewCount',
        admin.firestore.FieldValue.increment(1)
      );
      const updateUserViewCount = db
        .doc(`users/${snap.designerId}`)
        .update('viewCount', admin.firestore.FieldValue.increment(1));
      return Promise.all([updateThingViewCount, updateUserViewCount]);
    } else {
      functions.logger.info(`Thing ${snap.id} does not exist.`);
      return;
    }
  });
