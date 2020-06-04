import { firestore } from 'firebase';
import { User } from './user';
import { Thing } from './thing';

export interface Notification {
  type: 'like' | 'reply' | 'follow';
  designerId: string;
  fromUid: string;
  thingId: string;
  comment: string;
  updateAt: firestore.Timestamp;
}
export interface NotificationWithUserAndThing extends Notification {
  user: User;
  thing: Thing;
}
