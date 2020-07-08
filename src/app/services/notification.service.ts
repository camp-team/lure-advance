import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  Notification,
  NotificationWithUserAndThing,
} from '@interfaces/notification';
import { Thing } from '@interfaces/thing';
import { User } from '@interfaces/user';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ThingService } from './thing.service';
import { UserService } from './user.service';

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
    if (uid === undefined) {
      return of([]);
    }

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
            ).pipe(
              tap((users) => {
                console.log(users);
              })
            );
            const distinctThings: string[] = Array.from(
              new Set(notifications.map((item) => item.thingId))
            );
            const things$: Observable<Thing[]> = combineLatest(
              distinctThings.map((thingId) =>
                this.thingService.getThingByID(thingId)
              )
            );
            return combineLatest([of(notifications), users$, things$]);
          } else {
            return of([]);
          }
        }),
        map(([notifications, users, things]) => {
          if (notifications?.length) {
            return notifications.map((item) => {
              return {
                ...item,
                user: users.find((user) => user?.uid === item.fromUid),
                thing: things.find((thing) => thing?.id === item?.thingId),
              };
            });
          } else {
            return null;
          }
        })
      );
  }
}
