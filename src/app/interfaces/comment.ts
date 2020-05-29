import { firestore } from 'firebase';
import { User } from './user';

export interface Comment {
  id: string;
  uid: string;
  body: string;
  updateAt: firestore.Timestamp;
}

export interface CommentWithUser extends Comment {
  user: User;
}
