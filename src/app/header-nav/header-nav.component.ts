import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  @Output() activity: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {}

  user$: Observable<User> = this.authService.user$;
  uid: String = 'xxxx';
  // user: User;
  isProccesing: boolean;

  login() {
    this.isProccesing = true;
    this.authService
      .login()
      .then(() => {
        this.snackBar.open('ログインしました', null, {
          duration: 2000,
        });
      })
      .finally(() => {
        this.isProccesing = false;
      });
  }

  logout() {
    this.authService.logout().then(() => {
      this.snackBar.open('ログアウトしました', null, { duration: 2000 });
    });
  }

  clearNotificationCount(uid: string): Promise<void> {
    return this.notificationService.clearNotification(uid);
  }
}
