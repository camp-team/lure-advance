import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/';
import { Observable, combineLatest, of } from 'rxjs';
import { Thing } from '../interfaces/thing';
import { firestore } from 'firebase';
import { Comment, CommentWithUser } from '../interfaces/comment';
import { switchMap, map, take } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

  getAllComments(thingId: string): Observable<CommentWithUser[]> {
    let allComments: Comment[];
    return this.db
      .collection<Comment>(`things/${thingId}/comments`, (ref) =>
        ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((comments) => {
          allComments = comments;
          const distinctUids: string[] = [
            ...new Set(comments.map((comment) => comment.fromUid)),
          ];
          return combineLatest(
            distinctUids.map((uid) => this.userService.getUserByID(uid))
          );
        }),
        map((users) => {
          return allComments.map((comment) => {
            return {
              ...comment,
              user: users.find((user) => comment.fromUid === user.uid),
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

  replyComment(
    thingId: string,
    rootCommentId: string,
    reply: Omit<Comment, 'id' | 'updateAt'>
  ) {
    const id: string = this.db.createId();
    const newValue: Comment = {
      ...reply,
      id,
      replyCount: 0,
      updateAt: firestore.Timestamp.now(),
    };
    return this.db
      .doc<Comment>(
        `things/${thingId}/comments/${rootCommentId}/replies/${newValue.id}`
      )
      .set(newValue);
  }

  getRepliesByCommentId(
    thingId: string,
    rootCommentId: string
  ): Observable<CommentWithUser[]> {
    let allReplies: Comment[];
    return this.db
      .collection<Comment>(
        `things/${thingId}/comments/${rootCommentId}/replies`,
        (ref) => ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((replies) => {
          allReplies = replies;
          const distinctUids: string[] = Array.from(
            new Set(replies.map((comment) => comment.fromUid))
          );
          return combineLatest(
            distinctUids.map((uid) => this.userService.getUserByID(uid))
          );
        }),
        map((users) => {
          return allReplies.map((rep) => {
            return {
              ...rep,
              user: users.find((user) => user.uid === rep.fromUid),
            };
          });
        })
      );
  }

  updateComment(comment: Comment, thingId: string): Promise<void> {
    return this.db
      .doc<Comment>(`things/${thingId}/comments/${comment.id}`)
      .update({
        ...comment,
        updateAt: firestore.Timestamp.now(),
      });
  }

  updateReply(
    rootCommentId: string,
    reply: Comment,
    thingId: string
  ): Promise<void> {
    return this.db
      .doc<Comment>(
        `things/${thingId}/comments/${rootCommentId}/replies/${reply.id}`
      )
      .update({
        ...reply,
        updateAt: firestore.Timestamp.now(),
      });
  }

  deleteComment(comment: Comment, thingId: string): Promise<void> {
    return this.db
      .doc<Thing>(`things/${thingId}/comments/${comment.id}`)
      .delete();
  }

  deleteReply(
    rootCommentId: string,
    reply: Comment,
    thingId: string
  ): Promise<void> {
    return this.db
      .doc<Thing>(
        `things/${thingId}/comments/${rootCommentId}/replies/${reply.id}`
      )
      .delete();
  }
}
