import { firestore } from 'firebase';

export interface Thing {
  id: string;
  designerId: string;
  title: string;
  description: string;
  tags: string[];
  fileUrls: string[];
  commentCount: number;
  likeCount: number;
  updateAt: firestore.Timestamp;
}
