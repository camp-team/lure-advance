import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from '../services/notification.service';
import { SearchService } from '../services/search.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit {
  private index = this.searchService.index.things;
  searchOptions = [];

  user$: Observable<User> = this.userService.user$;

  isProccesing: boolean;

  ctrl: FormControl = new FormControl('');
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private searchService: SearchService,
    private router: Router
  ) {}

  @Output() activity: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
    this.ctrl.valueChanges.pipe(startWith('')).subscribe((key) => {
      this.index.search(key).then((result) => {
        this.searchOptions = result.hits;
      });
    });
  }

  login() {
    this.isProccesing = true;
    this.authService
      .login()
      .then(() => this.snackBar.open('ログインしました'))
      .finally(() => (this.isProccesing = false));
  }

  logout() {
    this.authService
      .logout()
      .then(() => this.snackBar.open('ログアウトしました'));
  }

  routeSearch(searchQuery) {
    this.router.navigate([''], {
      queryParams: {
        searchQuery: searchQuery || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  setSearchQuery(seachQuery) {
    this.ctrl.setValue(seachQuery, {
      emitEvent: false,
    });
  }

  clearNotificationCount(uid: string): Promise<void> {
    return this.notificationService.clearNotification(uid);
  }
}
