import { User } from './user';
import { firestore } from 'firebase';
import { Thing } from './thing';

export interface Notification {
  type: 'like' | 'reply' | 'follow';
  designerId: string;
  fromUid: string;
  thingId: string;
  name: string;
  thumbnailUrl: string;
  comment: string;
  avatarUrl: string;
  updateAt: firestore.Timestamp;
}
