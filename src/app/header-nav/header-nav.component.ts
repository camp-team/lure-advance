import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit {
  private index = this.searchService.index.things;
  searchOptions = [];

  user$: Observable<User> = this.authService.user$;

  isProccesing: boolean;

  ctrl: FormControl = new FormControl('');
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.ctrl.valueChanges.pipe(startWith('')).subscribe((key) => {
      this.index.search('').then((result) => {
        this.searchOptions = result.hits;
      });
    });
  }

  @Output() activity: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {}

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
