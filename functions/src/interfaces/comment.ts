import { firestore } from 'firebase';
import { User } from './user';
import { Thing } from './thing';

export interface Comment {
  id: string;
  designerId: string;
  fromUid: string;
  thingId: string;
  body: string;
  toUid: string;
  replyCount: number;
  createdAt: firestore.Timestamp;
  updateAt: firestore.Timestamp;
}

export interface CommentWithUser extends Comment {
  user: User;
}

export interface CommentWithUserAndThing extends CommentWithUser {
  thing: Thing;
}
