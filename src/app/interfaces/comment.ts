import { firestore } from 'firebase';

export interface Comment {
  id: string;
  name: string;
  body: string;
  avatarURL: string;
  updateAt: firestore.Timestamp;
}
