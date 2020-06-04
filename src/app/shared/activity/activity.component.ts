import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/interfaces/notification';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  notifications$: Observable<Notification[]> = this.authService.user$.pipe(
    switchMap((user) =>
      this.notificationService.getAllNotificationsByUid(user.uid)
    )
  );
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
}
