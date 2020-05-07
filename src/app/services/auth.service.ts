import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afUser$: Observable<User> = this.afAuth.user;
  uid: string;

  constructor(private afAuth: AngularFireAuth, private snackBar: MatSnackBar) {
    this.afUser$.subscribe((user) => {
      this.uid = user && user.uid;
    });
  }

  login() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(() => {
      this.snackBar.open('ログインに成功しました', null, {
        duration: 2000,
      });
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.snackBar.open('ログアウトしました', null, {
        duration: 2000,
      });
    });
  }
}
