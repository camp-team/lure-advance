import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  user$ = this.authService.afUser$;
  uid: String = 'xxxx';

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
}
