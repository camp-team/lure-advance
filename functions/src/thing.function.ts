import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { deleteCollection } from './utils/firebase-util';
import { Algolia } from './utils/algolia-util';

const storage = admin.storage().bucket();
const algolia = new Algolia();
const db = admin.firestore();

export const addThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const designerId = data.designerId;

    await db
      .doc(`users/${designerId}`)
      .update('thingCount', admin.firestore.FieldValue.increment(1));

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

    await db
      .doc(`users/${designerId}`)
      .update('thingCount', admin.firestore.FieldValue.increment(-1));

    await algolia.removeRecord('things', thingId);

    return Promise.all([
      deleteCollection(`things/${thingId}/likeUsers`),
      deleteCollection(`things/${thingId}/comments`),
      storage.deleteFiles({
        directory: `things/${thingId}/files`,
      }),
    ]);
  });
