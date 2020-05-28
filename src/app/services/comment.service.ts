import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/';
import { Observable, combineLatest } from 'rxjs';
import { Thing } from '../interfaces/thing';
import { firestore } from 'firebase';
import { Comment, CommentWithUser } from '../interfaces/comment';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  getAllComments(thingId: string): Observable<CommentWithUser[]> {
    let tmpComments: Comment[];
    return this.db
      .collection<Comment>(`things/${thingId}/comments`, (ref) =>
        ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((comments) => {
          tmpComments = comments;
          return combineLatest(
            comments.map((comment) => this.userService.getUserByID(comment.uid))
          );
        }),
        map((users) => {
          return tmpComments.map((comment) => {
            return {
              ...comment,
              user: users.find((user) => comment.uid === user.uid),
            };
          });
        })
      );
  }

  addComment(
    thingId: string,
    comment: Omit<Comment, 'id' | 'updateAt'>
  ): Promise<void> {
    const id: string = this.db.createId();
    const newValue: Comment = {
      ...comment,
      id,
      updateAt: firestore.Timestamp.now(),
    };
    return this.db
      .doc<Comment>(`things/${thingId}/comments/${newValue.id}`)
      .set(newValue);
  }

  updateComment(comment: Comment, thingId: string): Promise<void> {
    return this.db
      .doc<Comment>(`things/${thingId}/comments/${comment.id}`)
      .update({
        ...comment,
        updateAt: firestore.Timestamp.now(),
      });
  }

  deleteComment(comment: Comment, thingId: string): Promise<void> {
    return this.db
      .doc<Thing>(`things/${thingId}/comments/${comment.id}`)
      .delete();
  }
}
