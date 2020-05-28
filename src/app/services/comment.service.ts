import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { AngularFireStorage } from '@angular/fire/storage/storage';
import { Observable } from 'rxjs';
import { Thing } from '../interfaces/thing';
import { firestore } from 'firebase';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private db: AngularFirestore) {}

  getAllComments(thing: Thing): Observable<Comment[]> {
    return this.db
      .collection<Comment>(`things/${thing.id}/comments`)
      .valueChanges();
  }

  getThingByID(thingId: string): Observable<Thing> {
    return this.db.doc<Thing>(`things/${thingId}`).valueChanges();
  }

  addComment(
    thing: Thing,
    comment: Omit<Comment, 'id' | 'updateAt'>
  ): Promise<void> {
    const id: string = this.db.createId();
    const newValue: Comment = {
      ...comment,
      id,
      updateAt: firestore.Timestamp.now(),
    };
    return this.db
      .doc<Comment>(`things/${thing.id}/comments/${newValue.id}`)
      .set(newValue);
  }

  updateThing(comment: Comment, thing: Thing): Promise<void> {
    return this.db
      .doc<Comment>(`things/${thing.id}/comments/${comment.id}`)
      .update(comment);
  }

  deleteThing(comment: Comment, thing: Thing): Promise<void> {
    return this.db
      .doc<Thing>(`things/${thing.id}/comments/${comment.id}`)
      .delete();
  }
}
