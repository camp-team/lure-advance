import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { firestore } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take, switchMap, tap, filter } from 'rxjs/operators';
import { User } from '@interfaces/user';
import { UserService } from './user.service';
import { ThingReference } from '@interfaces/thing-reference';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root',
})
export class ThingService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService,
    private fns: AngularFireFunctions
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
        if (thing) {
          const user$: Observable<User> = this.userService.getUserByID(
            thing.designerId
          );
          return combineLatest([of(thing), user$]);
        } else {
          return of([]);
        }
      }),
      map(([thing, user]) => {
        return thing
          ? {
              ...thing,
              user: user,
            }
          : null;
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
        ref.where('designerId', '==', uid).orderBy('updateAt', 'desc').limit(2)
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
    if (uid === undefined) {
      return null;
    }
    return this.db
      .collectionGroup<{
        thingId: string;
        fromUid: string;
        designerId: string;
      }>('likeUsers', (ref) => ref.where('fromUid', '==', uid))
      .valueChanges()
      .pipe(
        switchMap((likeThings) => {
          if (likeThings.length) {
            return combineLatest(
              likeThings.map((item) => this.getThingByID(item.thingId))
            );
          } else {
            return of(null);
          }
        })
      );
  }

  getLikedThingIdsWithPromise(uid: string): Promise<string[]> {
    return this.getLikedThings(uid)
      .pipe(
        map((things) => {
          if (things === null) {
            return [];
          } else {
            return things.filter(Boolean).map((thing) => thing.id);
          }
        }),
        take(1)
      )
      .toPromise();
  }

  async isLiked(uid: string, thingId: string): Promise<boolean> {
    if (uid === undefined) return false;
    if (thingId === undefined) return false;
    const likedThingIds: string[] = await this.getLikedThingIdsWithPromise(uid);
    return likedThingIds.includes(thingId);
  }

  createThing(thing: Omit<Thing, 'updateAt' | 'createdAt'>): Promise<void> {
    if (thing.imageUrls.length <= 0) {
      throw new Error('image file is required.');
    }
    const value: Thing = {
      ...thing,
      createdAt: firestore.Timestamp.now(),
      updateAt: firestore.Timestamp.now(),
    };
    return this.db.doc<Thing>(`things/${thing.id}`).set(value);
  }

  updateThing(thing: Thing): Promise<void> {
    return this.db.doc<Thing>(`things/${thing.id}`).update({
      ...thing,
      updateAt: firestore.Timestamp.now(),
    });
  }

  deleteThing(thing: Thing): Promise<void> {
    return this.db.doc<Thing>(`things/${thing.id}`).delete();
  }

  async saveOnStorage(
    thingId: string,
    imageFiles: (File | string)[],
    defaultImageLength: number = 0
  ): Promise<string[]> {
    await this.deleteUploadedFile(thingId, imageFiles, defaultImageLength);
    return this.getPromiseAllDwonLoadUrls(thingId, imageFiles);
  }

  private deleteUploadedFile(
    thingId: string,
    files: (File | string | ThingReference)[],
    defaultLength: number
  ): Promise<any> {
    if (defaultLength > files.length) {
      const deleteCount = defaultLength - files.length;
      return Promise.all(
        new Array(deleteCount).fill(null).map(async (_, index) => {
          const i = defaultLength - index - 1;
          const path = `things/${thingId}/images/${thingId}-${i}`;
          return this.storage.ref(path).delete().toPromise();
        })
      );
    }
  }

  private getPromiseAllDwonLoadUrls(
    thingId: string,
    files: (File | string)[]
  ): Promise<string[]> {
    return Promise.all(
      files.map(async (file, index) => {
        if (file instanceof File) {
          return await this.uploadAndgetDownLoadUrl(thingId, file, index);
        } else {
          return file;
        }
      })
    );
  }

  private async uploadAndgetDownLoadUrl(
    thingId: string,
    file: File,
    index: number
  ): Promise<string> {
    const path: string = `things/${thingId}/images/${thingId}-${index}`;
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

  incrementViewCount(thing: Thing): Promise<any> {
    if (thing === undefined) {
      return;
    }
    const call = this.fns.httpsCallable('incrementViewCount');
    return call(thing).toPromise();
  }
}
