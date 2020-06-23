import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
export { createUser } from './user.function';
export { likeThing, unLikeThing } from './like.function';
export { addReply, deleteReply, deleteComment } from './comment.function';
export { deleteFiles } from './thing.function';
