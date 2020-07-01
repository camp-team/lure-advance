import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
export { createUser } from './user.function';
export { likeThing, unLikeThing } from './like.function';
export {
  addReply,
  addComment,
  deleteReply,
  deleteComment,
} from './comment.function';
export { deleteThing, addThing, updateThing } from './thing.function';
