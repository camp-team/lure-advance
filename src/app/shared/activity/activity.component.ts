import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationWithUserAndThing } from 'src/app/interfaces/notification';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  notifications$: Observable<
    NotificationWithUserAndThing[]
  > = this.authService.user$.pipe(
    switchMap((user) =>
      this.notificationService.getNotificationsByUid(user.uid)
    )
  );
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
}
