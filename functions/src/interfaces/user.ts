export interface User {
  uid: string;
  email: string;
  avatarURL: string;
  name: string;
  notificationCount: number;
  thingCount: number;
  downloadCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  description: string;
  weblink: string;
  createdAt: firestore.Timestamp;
}
