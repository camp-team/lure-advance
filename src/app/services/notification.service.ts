import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { firestore } from 'firebase';
import { UserService } from './user.service';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Notification, NotificationWithUser } from '../interfaces/notification';

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

  getNotificationsByUid(uid: string): Observable<NotificationWithUser[]> {
    let allnotifications: Notification[];
    return this.db
      .collection<Notification>(`users/${uid}/notifications`, (ref) =>
        ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((notifications) => {
          allnotifications = notifications;

          const distinctUids: string[] = Array.from(
            new Set(notifications.map((item) => item.fromUid))
          );
          return combineLatest(
            distinctUids.map((uid) => this.userService.getUserByID(uid))
          );
        }),
        map((users) => {
          return allnotifications.map((item) => {
            return {
              ...item,
              user: users.find((user) => user.uid === item.fromUid),
            };
          });
        })
      );
  }

  getDummyData(): Notification[] {
    const dammy: Notification = {
      type: 'reply',
      designerId: 'xxxx',
      fromUid: 'fromuid',
      name: 'xxxxx',
      thumbnailUrl: 'https://placehold.jp/700x525.png',
      thingId: 'xxxxxx',
      comment: 'hogehogehoge',
      updateAt: firestore.Timestamp.now(),
    };
    return new Array(16).fill(dammy);
  }
}
