import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ThingReference } from '@interfaces/thing-reference';
import { firestore } from 'firebase';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class ThingReferenceService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getThingRefById(thingId: string) {
    return this.db
      .collection<ThingReference>(`things/${thingId}/stls`)
      .valueChanges()
      .pipe(map((refs) => (refs.length ? refs[0] : null)));
  }

  deleteThingRef(thingId: string, refId: string): Promise<void> {
    return this.db.doc(`things/${thingId}/stls/${refId}`).delete();
  }

  createThingRef(
    thingId: string,
    ref: Omit<ThingReference, 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const newValue: ThingReference = {
      ...ref,
      updatedAt: firestore.Timestamp.now(),
      createdAt: firestore.Timestamp.now(),
    };
    return this.db.doc(`things/${thingId}/stls/${ref}`).set(newValue);
  }

  async saveOnStorage(
    thingId: string,
    file: File
  ): Promise<Omit<ThingReference, 'createdAt' | 'updatedAt'>> {
    if (file === undefined) {
      return;
    }
    const id = this.db.createId();
    const path: string = `things/${thingId}/stls/${id}/${file.name}`;
    const task = await this.storage.ref(path).put(file);
    const url: string = await task.ref.getDownloadURL();
    return {
      id,
      thingId: thingId,
      downloadUrl: url,
      fileName: file.name,
      fileSize: file.size,
      downloadCount: 0,
    };
  }
}
