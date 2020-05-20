import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Thing } from '../interfaces/thing';

@Injectable({
  providedIn: 'root',
})
export class ThingService {
  constructor(private db: AngularFirestore) {}

  getAllThings(): Observable<Thing[]> {
    return this.db.collection<Thing>('things').valueChanges();
  }

  getThingByID(thingId: string): Observable<Thing> {
    return this.db.doc<Thing>(`things/${thingId}`).valueChanges();
  }

  createThing(
    thing: Omit<Thing, 'id' | 'designerId' | 'likeCount' | 'updateAt'>,
    userId: string
  ): Promise<void> {
    const id = this.db.createId();
    const value: Thing = {
      ...thing,
      id,
      designerId: userId,
      likeCount: 0,
      updateAt: new Date(),
    };
    return this.db.doc<Thing>(`things/${id}`).set(value);
  }

  updateThing(thing: Thing): Promise<void> {
    return this.db.doc<Thing>(`things/${thing.id}`).update(thing);
  }

  delteThing(thing: Thing): Promise<void> {
    return this.db.doc<Thing>(`things/${thing.designerId}`).delete();
  }
}
