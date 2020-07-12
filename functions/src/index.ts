import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
export * from './user.function';
export * from './like.function';
export * from './comment.function';
export * from './thing.function';
export { scheduledFirestoreExport } from './backup.function';
