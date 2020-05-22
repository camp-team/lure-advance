import { firestore } from 'firebase';

export interface Thing {
  id: string;
  designerId: string;
  title: string;
  description: string;
  tags: string[];
  filesUrls: string[];
  likeCount: number;
  updateAt: firestore.Timestamp;
}
