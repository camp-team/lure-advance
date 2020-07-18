import { firestore } from 'firebase';

export interface ThingReference {
  id: string;
  thingId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  updatedAt: firestore.Timestamp;
  createdAt: firestore.Timestamp;
}
