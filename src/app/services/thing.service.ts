import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { Thing, ThingWithUser } from '../interfaces/thing';
import { firestore } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { UserService } from './user.service';

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
    return this.db
      .collection<Thing>(`things`, (ref) => ref.orderBy('updateAt', 'desc'))
      .valueChanges()
      .pipe(
        switchMap((things: Thing[]) => {
          const distinctUids: string[] = Array.from(
            new Set(things.map((thing) => thing.designerId))
          );

          const users$: Observable<User[]> = combineLatest(
            distinctUids.map((uid) => this.userService.getUserByID(uid))
          );

          return combineLatest([of(things), users$]);
        }),
        map(([things, users]) => {
          return things.map((thing) => {
            return {
              ...thing,
              user: users.find((user) => thing.designerId === user.uid),
            };
          });
        })
      );
  }

  getThingsWithPromise(): Promise<ThingWithUser[]> {
    return this.getThings().pipe(take(1)).toPromise();
  }

  getThingByID(thingId: string): Observable<Thing> {
    return this.db.doc<Thing>(`things/${thingId}`).valueChanges();
  }

  getThingsByDesignerID(uid: string): Observable<Thing[]> {
    return this.db
      .collection<Thing>(`things`, (ref) =>
        ref.where('designerId', '==', uid).orderBy('updateAt', 'desc')
      )
      .valueChanges();
  }

  getThingsLatestByDesignerID(uid: string): Observable<Thing[]> {
    return this.db
      .collection<Thing>(`things`, (ref) =>
        ref.where('designerId', '==', uid).orderBy('updateAt', 'desc').limit(1)
      )
      .valueChanges();
  }

  getThingsOrderByLikeCount(uid: string): Observable<Thing[]> {
    return this.db
      .collection<Thing>(`things`, (ref) =>
        ref.where('designerId', '==', uid).orderBy('likeCount', 'desc').limit(3)
      )
      .valueChanges();
  }

  getLikedThings(uid: string): Observable<Thing[]> {
    return this.db
      .collectionGroup<{
        thingId: string;
        fromUid: string;
        designerId: string;
      }>('likeUsers', (ref) => ref.where('fromUid', '==', uid))
      .valueChanges()
      .pipe(
        switchMap((likeThings) =>
          combineLatest(
            likeThings.map((item) => this.getThingByID(item.thingId))
          )
        )
      );
  }

  getLikedThingIdsWithPromise(uid: string): Promise<string[]> {
    return this.db
      .collectionGroup<{
        thingId: string;
        fromUid: string;
        designerId: string;
      }>('likeUsers', (ref) => ref.where('fromUid', '==', uid))
      .valueChanges()
      .pipe(
        map((res) => res.map((item) => item.thingId)),
        take(1)
      )
      .toPromise();
  }

  getMyLikedThingsByUid(uid: string): Promise<string[]> {
    return this.db
      .collection<string>(`users/${uid}/likedThings`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
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

  likeThing(thing: Thing, uid: string): Promise<void> {
    return this.db.doc(`things/${thing.id}/likeUsers/${uid}`).set({
      thingId: thing.id,
      designerId: thing.designerId,
      fromUid: uid,
    });
  }

  unLikeThing(thingId: string, uid: string): Promise<void> {
    console.log('hogehoge');
    return this.db.doc(`things/${thingId}/likeUsers/${uid}`).delete();
  }
}
