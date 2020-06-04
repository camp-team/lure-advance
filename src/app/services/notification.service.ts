import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification';
import { firestore } from 'firebase';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  clearNotification(uid: string): Promise<void> {
    return this.db.doc<User>(`users/${uid}`).update({
      notificationCount: 0,
    });
  }

  getAllNotificationsByUid(uid: string): Observable<Notification[]> {
    return this.db
      .collection<Notification>(`users/${uid}/notifications`, (ref) =>
        ref.orderBy('updateAt', 'desc')
      )
      .valueChanges();
  }

  getDummyData(): Notification[] {
    const dammy: Notification = {
      type: 'reply',
      designerId: 'xxxx',
      fromUid: 'fromuid',
      avatarUrl: 'https://placehold.jp/40x40.png',
      name: 'xxxxx',
      thumbnailUrl: 'https://placehold.jp/700x525.png',
      thingId: 'xxxxxx',
      comment: 'hogehogehoge',
      updateAt: firestore.Timestamp.now(),
    };
    return new Array(16).fill(dammy);
  }
}
