import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private db: AngularFirestore) {}

  clearNotification(uid: string): Promise<void> {
    return this.db.doc<User>(`users/${uid}`).update({
      notificationCount: 0,
    });
  }

  getAllNotificationsByUid(uid: string): Observable<Notification[]> {
    return this.db
      .collection<Notification>(`users/${uid}/notifications`)
      .valueChanges();
  }
}
