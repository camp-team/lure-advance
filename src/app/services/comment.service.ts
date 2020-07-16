import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/';
import {
  Comment,
  CommentWithUser,
  CommentWithUserAndThing,
} from '@interfaces/comment';
import { Thing } from '@interfaces/thing';
import { User } from '@interfaces/user';
import { firestore } from 'firebase';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ThingService } from './thing.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private thingService: ThingService
  ) {}

  getAllComments(thingId: string): Observable<CommentWithUser[]> {
    return this.db
      .collection<Comment>(`things/${thingId}/comments`, (ref) =>
        ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((comments: Comment[]) => {
          if (comments.length) {
            const distinctUids: string[] = [
              ...new Set(comments.map((comment) => comment.fromUid)),
            ];

            const users$: Observable<User[]> = combineLatest(
              distinctUids.map((uid) => this.userService.getUserByID(uid))
            );
            return combineLatest([of(comments), users$]);
          } else {
            return of([]);
          }
        }),
        map(([comments, users]) => {
          if (comments?.length) {
            return comments.map((comment) => {
              return {
                ...comment,
                user: users.find((user) => comment.fromUid === user?.uid),
              };
            });
          } else {
            return [];
          }
        })
      );
  }

  getCommentsByDesignerId(
    designerId: string
  ): Observable<CommentWithUserAndThing[]> {
    if (designerId === undefined) {
      return of(null);
    }

    return this.db
      .collectionGroup<Comment>('comments', (ref) =>
        ref.where('designerId', '==', designerId)
      )
      .valueChanges()
      .pipe(
        switchMap((comments: Comment[]) => {
          if (comments.length) {
            const distinctUids: string[] = Array.from(
              new Set(comments.map((comment) => comment.fromUid))
            );

            const users$: Observable<User[]> = combineLatest(
              distinctUids.map((uid) => this.userService.getUserByID(uid))
            );

            const distinctThingIds: string[] = Array.from(
              new Set(comments.map((comment) => comment.thingId))
            );

            const things$: Observable<Thing[]> = combineLatest(
              distinctThingIds.map((thingId) =>
                this.thingService.getThingByID(thingId)
              )
            );

            return combineLatest([of(comments), things$, users$]);
          } else {
            return of([]);
          }
        }),
        map(([comments, things, users]) => {
          if (comments?.length) {
            return comments.map((comment: Comment) => {
              return {
                ...comment,
                user: users.find((user: User) => comment.fromUid === user?.uid),
                thing: things.find(
                  (thing: Thing) => comment.thingId === thing?.id
                ),
              };
            });
          } else {
            return [];
          }
        })
      );
  }

  getCommentsByID(
    thingId: string,
    commentId: string
  ): Observable<CommentWithUser> {
    return this.db
      .doc<Comment>(`things/${thingId}/comments/${commentId}`)
      .valueChanges()
      .pipe(
        switchMap((comment) => {
          const user$ = this.userService.getUserByID(comment.fromUid);
          return combineLatest([of(comment), user$]);
        }),
        map(([comment, user]) => {
          return {
            ...comment,
            user: user,
          };
        })
      );
  }

  addComment(comment: Omit<Comment, 'id' | 'updateAt'>): Promise<void> {
    const id: string = this.db.createId();
    const newValue: Comment = {
      ...comment,
      id,
      updateAt: firestore.Timestamp.now(),
    };
    return this.db
      .doc<Comment>(`things/${comment.thingId}/comments/${newValue.id}`)
      .set(newValue);
  }

  replyComment(rootCommentId: string, reply: Omit<Comment, 'id' | 'updateAt'>) {
    const id: string = this.db.createId();
    const newValue: Comment = {
      ...reply,
      id,
      replyCount: 0,
      updateAt: firestore.Timestamp.now(),
    };
    return this.db
      .doc<Comment>(
        `things/${reply.thingId}/comments/${rootCommentId}/replies/${newValue.id}`
      )
      .set(newValue);
  }

  getRepliesByCommentId(
    thingId: string,
    rootCommentId: string
  ): Observable<CommentWithUser[]> {
    return this.db
      .collection<Comment>(
        `things/${thingId}/comments/${rootCommentId}/replies`,
        (ref) => ref.orderBy('updateAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((replies) => {
          if (replies.length) {
            const distinctUids: string[] = Array.from(
              new Set(replies.map((comment) => comment.fromUid))
            );
            const users$ = combineLatest(
              distinctUids.map((uid) => this.userService.getUserByID(uid))
            );
            return combineLatest([of(replies), users$]);
          } else {
            return of([]);
          }
        }),
        map(([replies, users]) => {
          if (replies?.length) {
            return replies.map((rep) => {
              return {
                ...rep,
                user: users.find((user) => user.uid === rep.fromUid),
              };
            });
          } else {
            return [];
          }
        })
      );
  }

  updateComment(comment: Comment): Promise<void> {
    return this.db
      .doc<Comment>(`things/${comment.thingId}/comments/${comment.id}`)
      .update({
        ...comment,
        updateAt: firestore.Timestamp.now(),
      });
  }

  updateReply(rootCommentId: string, reply: Comment): Promise<void> {
    return this.db
      .doc<Comment>(
        `things/${reply.thingId}/comments/${rootCommentId}/replies/${reply.id}`
      )
      .update({
        ...reply,
        updateAt: firestore.Timestamp.now(),
      });
  }

  deleteComment(comment: Comment): Promise<void> {
    return this.db
      .doc<Thing>(`things/${comment.thingId}/comments/${comment.id}`)
      .delete();
  }

  deleteReply(rootCommentId: string, reply: Comment): Promise<void> {
    return this.db
      .doc<Thing>(
        `things/${reply.thingId}/comments/${rootCommentId}/replies/${reply.id}`
      )
      .delete();
  }
}
