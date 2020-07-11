const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

// Replace BUCKET_NAME
const bucket = 'gs://lure-advance';

export const scheduledFirestoreExport = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 24 hours')
  .onRun(() => {
    const databaseName = client.databasePath(
      process.env.GCP_PROJECT,
      '(default)'
    );

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave cllectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: [
          'users',
          'things',
          'comments',
          'likeUsers',
          'likedThings',
          'replies',
          'notifications',
        ],
      })
      .then((responses: any) => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
        console.log(response);
        return true;
      })
      .catch((err: any) => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  });
