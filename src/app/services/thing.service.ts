import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { Thing, ThingWithUser } from '../interfaces/thing';
import { firestore } from 'firebase';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';
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

  getThingWithUserById(id: string): Observable<ThingWithUser> {
    return this.getThingByID(id).pipe(
      switchMap((thing) => {
        const user$: Observable<User> = this.userService.getUserByID(
          thing.designerId
        );
        return combineLatest([of(thing), user$]);
      }),
      map(([thing, user]) => {
        return {
          ...thing,
          user: user,
        };
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

  createThing(thing: Omit<Thing, 'updateAt'>): Promise<void> {
    const value: Thing = {
      ...thing,
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

  async uploadFiles(
    thingId: string,
    stlFiles: (File | string)[],
    imageFiles: (File | string)[],
    defaultImageLength: number = 0,
    defaultStlLength: number = 0
  ) {
    await this.deleteUploadedFile(thingId, stlFiles, defaultStlLength, 'stl');

    await this.deleteUploadedFile(
      thingId,
      imageFiles,
      defaultImageLength,
      'image'
    );

    const stlUrls: string[] = await this.getPromiseAllDwonLoadUrls(
      thingId,
      stlFiles,
      'stl'
    );

    const imageUrls: string[] = await this.getPromiseAllDwonLoadUrls(
      thingId,
      imageFiles,
      'image'
    );

    return { stlUrls, imageUrls };
  }

  private deleteUploadedFile(
    thingId: string,
    files: (File | string)[],
    defaultLength: number,
    type: string
  ): Promise<any> {
    if (defaultLength > files.length) {
      const deleteCount = defaultLength - files.length;
      return Promise.all(
        new Array(deleteCount).fill(null).map(async (_, index) => {
          const i = defaultLength - index - 1;
          const path = `things/${thingId}/files/${thingId}-${type}-${i}`;
          return this.storage.ref(path).delete().toPromise();
        })
      );
    }
  }

  getFileNameByUrl(url: string): string {
    return this.storage.storage.refFromURL(url).name;
  }

  private getPromiseAllDwonLoadUrls(
    thingId: string,
    files: (File | string)[],
    type: string
  ): Promise<string[]> {
    return Promise.all(
      files.map(async (file, index) => {
        if (file instanceof File) {
          return await this.uploadAndgetDownLoadUrl(thingId, file, type, index);
        } else {
          return file;
        }
      })
    );
  }

  private async uploadAndgetDownLoadUrl(
    thingId: string,
    file: File,
    type: string,
    index: number
  ): Promise<string> {
    const path: string = `things/${thingId}/files/${thingId}-${type}-${index}`;
    const ref = this.storage.ref(path);
    await this.storage.upload(path, file);
    return await ref.getDownloadURL().toPromise();
  }

  likeThing(thing: Thing, uid: string): Promise<void> {
    return this.db.doc(`things/${thing.id}/likeUsers/${uid}`).set({
      thingId: thing.id,
      designerId: thing.designerId,
      fromUid: uid,
    });
  }

  unLikeThing(thingId: string, uid: string): Promise<void> {
    return this.db.doc(`things/${thingId}/likeUsers/${uid}`).delete();
  }
}
