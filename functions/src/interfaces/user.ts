import { firestore } from 'firebase-admin';

export interface User {
  uid: string;
  email: string;
  avatarURL: string;
  name: string;
  notificationCount: number;
  thingCount: number;
  downloadCount: number;
  viewCount: number;
  commentCount: number;
  description: string;
  weblink: string;
  createdAt: firestore.Timestamp;
}
