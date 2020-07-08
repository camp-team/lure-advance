import { firestore } from 'firebase';

export interface ThingFile {
  thumbnailUrl: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  updatedAt: firestore.Timestamp;
}
