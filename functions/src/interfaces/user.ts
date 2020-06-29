export interface User {
  uid: string;
  email: string;
  avatarURL: string;
  name: string;
  notificationCount: number;
  thingCount: number;
  description?: string;
  weblink?: string;
}
