import { firestore } from 'firebase';
import { User } from './user';

export interface Notification {
  type: 'like' | 'reply' | 'follow';
  designerId: string;
  fromUid: string;
  thingId: string;
  name: string;
  thumbnailUrl: string;
  comment: string;
  updateAt: firestore.Timestamp;
}
export interface NotificationWithUser extends Notification {
  user: User;
}
