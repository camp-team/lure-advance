import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Thing } from '../interfaces/thing';
import { firestore } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ThingService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getAllThings(): Observable<Thing[]> {
    return this.db.collection<Thing>('things').valueChanges();
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
}
