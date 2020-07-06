import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationWithUserAndThing } from '@interfaces/notification';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  notifications$: Observable<
    NotificationWithUserAndThing[]
  > = this.userService.user$.pipe(
    switchMap((user) => {
      if (user) {
        return this.notificationService.getNotificationsByUid(user.uid);
      } else {
        return of([]);
      }
    })
  );

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  deleteItem(id: string) {
    const uid: string = this.userService.uid;
    if (uid) {
      this.notificationService
        .deleteNotification(id, uid)
        .then(() => this.snackBar.open('削除しました。'));
    }
  }

  ngOnInit(): void {}
}
