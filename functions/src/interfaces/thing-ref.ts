import { firestore } from 'firebase';

export interface ThingRef {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  updatedAt: firestore.Timestamp;
}
