import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Algolia } from './utils/algolia-util';

const storage = admin.storage().bucket();
const algolia = new Algolia();

export const addThing = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
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
    if (data) {
      await algolia.removeRecord('things', data.id);
    }
    //ストレージのデータを一括削除
    return storage.deleteFiles({
      directory: `things/${thingId}/files`,
    });
  });
