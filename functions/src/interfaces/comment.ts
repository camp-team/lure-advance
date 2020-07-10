import { firestore } from 'firebase';
import { User } from './user';

export interface Comment {
  id: string;
  designerId: string;
  fromUid: string;
  thingId: string;
  body: string;
  toUid: string;
  replyCount: number;
  updateAt: firestore.Timestamp;
}

export interface CommentWithUser extends Comment {
  user: User;
}
