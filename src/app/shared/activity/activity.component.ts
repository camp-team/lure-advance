import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationWithUserAndThing } from '@interfaces/notification';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  notifications$: Observable<
    NotificationWithUserAndThing[]
  > = this.authService.user$.pipe(
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
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  deleteItem(id: string) {
    const uid: string = this.authService.uid;
    if (uid) {
      this.notificationService
        .deleteNotification(id, uid)
        .then(() => this.snackBar.open('削除しました。'));
    }
  }

  ngOnInit(): void {}
}
