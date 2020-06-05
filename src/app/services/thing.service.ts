import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { Thing, ThingWithUser } from '../interfaces/thing';
import { firestore } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { UserService } from './user.service';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class ThingService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService
  ) {}

  getThings(): Observable<ThingWithUser[]> {
    let allthings: Thing[];
    return this.db
      .collection<Thing>(`things`, (ref) => ref.orderBy('updateAt', 'desc'))
      .valueChanges()
      .pipe(
        switchMap((things: Thing[]) => {
          allthings = things;
          const distinctUids: string[] = [
            ...new Set(things.map((thing) => thing.designerId)),
          ];
          return combineLatest(
            distinctUids.map((uid) => this.userService.getUserByID(uid))
          );
        }),
        map((users: User[]) => {
          return allthings.map((thing) => {
            return {
              ...thing,
              user: users.find((user) => thing.designerId === user.uid),
            };
          });
        })
      );
  }

  getThingByID(thingId: string): Observable<Thing> {
    return this.db.doc<Thing>(`things/${thingId}`).valueChanges();
  }

  createThing(thing: Omit<Thing, 'updateAt' | 'fileUrls'>): Promise<void> {
    const value: Thing = {
      ...thing,
      fileUrls: ['https://placehold.jp/700x525.png'], //TODO
      updateAt: firestore.Timestamp.now(),
    };
    return this.db.doc<Thing>(`things/${thing.id}`).set(value);
  }

  updateThing(thing: Thing): Promise<void> {
    return this.db.doc<Thing>(`things/${thing.id}`).update(thing);
  }

  deleteThing(thing: Thing): Promise<void> {
    return this.db.doc<Thing>(`things/${thing.id}`).delete();
  }

  uploadThings(id: string, files: File[]): Promise<any> {
    return Promise.all(
      files.map(async (file, index) => {
        const path: string = `things/${id}/files/${id}-${index}`;
        await this.storage.upload(path, file);
        return this.storage.ref(path).getDownloadURL().toPromise();
      })
    );
  }

  likeThing(thing: Thing, user: User): Promise<void> {
    return this.db.doc(`things/${thing.id}/likeUsers/${user.uid}`).set({
      designerId: thing.designerId,
      fromUid: user.uid,
    });
  }

  unLikeThing(thingId: string, uid: string): Promise<void> {
    return this.db.doc(`things/${thingId}/likeUsers/${uid}`).delete();
  }

  getlikedThingIds(uid: string): Promise<string[]> {
    return this.db
      .collectionGroup<{
        uid: string;
        thingId: string;
      }>('likeUser', (ref) => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(
        map((res) => res.map((item) => item.thingId)),
        take(1)
      )
      .toPromise();
  }
}
