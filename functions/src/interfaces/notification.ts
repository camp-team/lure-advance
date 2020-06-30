import { firestore } from 'firebase';
import { Thing } from './thing';
import { User } from './user';

export interface Notification {
  id: string;
  type: 'like' | 'reply' | 'follow';
  toUid: string;
  fromUid: string;
  thingId: string;
  comment: string;
  updateAt: firestore.Timestamp;
}
export interface NotificationWithUserAndThing extends Notification {
  user: User;
  thing: Thing;
}
