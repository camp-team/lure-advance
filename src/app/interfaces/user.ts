export interface User {
  uid: string;
  email: string;
  avatarURL: string;
  name: string;
  notificationCount: number;
  description?: string;
  weblink?: string;
}
