import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { UserService } from './user.service';
import { switchMap, map, filter } from 'rxjs/operators';
import { User } from '@interfaces/user';
import {
  Notification,
  NotificationWithUserAndThing,
} from '@interfaces/notification';
import { ThingService } from './thing.service';
import { Thing } from '@interfaces/thing';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private thingService: ThingService
  ) {}

  clearNotification(uid: string): Promise<void> {
    return this.db.doc<User>(`users/${uid}`).update({
      notificationCount: 0,
    });
  }

  deleteNotification(id: string, uid: string): Promise<void> {
    return this.db
      .doc<Notification>(`users/${uid}/notifications/${id}`)
      .delete();
  }

  getNotificationsByUid(
    uid: string
  ): Observable<NotificationWithUserAndThing[]> {
    return this.db
      .collection<Notification>(`users/${uid}/notifications`, (ref) =>
        ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((notifications: Notification[]) => {
          if (notifications.length) {
            const distinctUids: string[] = Array.from(
              new Set(notifications.map((item) => item.fromUid))
            );
            const users$: Observable<User[]> = combineLatest(
              distinctUids.map((uid) => this.userService.getUserByID(uid))
            );
            const distinctThings: string[] = Array.from(
              new Set(notifications.map((item) => item.thingId))
            );
            const things$: Observable<Thing[]> = combineLatest(
              distinctThings.map(
                (thingId) =>
                  this.thingService
                    .getThingByID(thingId)
                    .pipe(filter((thing) => Boolean(thing))) //投稿データが削除されている場合がある
              )
            );
            return combineLatest([of(notifications), users$, things$]);
          } else {
            of([]);
          }
        }),
        map(([notifications, users, things]) => {
          if (notifications?.length) {
            return notifications.map((item) => {
              return {
                ...item,
                user: users.find((user) => user.uid === item.fromUid),
                thing: things.find((thing) => thing.id === item.thingId),
              };
            });
          } else {
            return [];
          }
        })
      );
  }
}
