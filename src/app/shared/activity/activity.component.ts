import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentWithUser } from '@interfaces/comment';
import { NotificationWithUserAndThing } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommentService } from 'src/app/services/comment.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  user$: Observable<User> = this.userService.user$;
  notifications$: Observable<NotificationWithUserAndThing[]> = this.user$.pipe(
    switchMap((user) => {
      return this.notificationService.getNotificationsByUid(user?.uid);
    })
  );

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private commentService: CommentService
  ) {}

  deleteItem(id: string) {
    const uid: string = this.userService.uid;
    if (uid) {
      this.notificationService
        .deleteNotification(id, uid)
        .then(() => this.snackBar.open('削除しました。'));
    }
  }

  getThumbnailUrl(item: NotificationWithUserAndThing): string {
    return item.thing?.imageUrls[0] || 'assets/images/no_image.png';
  }

  rootComment$: Observable<CommentWithUser>;
  replyComments$: Observable<CommentWithUser[]>;
  isLoading: boolean;
  thingId: string;
  loadComments(notification: NotificationWithUserAndThing) {
    if (notification.type === 'reply') {
      this.isLoading = true;
      this.thingId = notification.thingId;
      this.rootComment$ = this.commentService.getCommentsByID(
        notification.thingId,
        notification.commentId
      );
    }
  }

  ngOnInit(): void {}
}
