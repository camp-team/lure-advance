import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const storage = admin.storage().bucket();

export const deleteFiles = functions
  .region('asia-northeast1')
  .firestore.document('things/{thingId}')
  .onDelete(async (_, context) => {
    const thingId = context.params.thingId;
    return storage.deleteFiles({
      directory: `things/${thingId}/files`,
    });
  });
