import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User> = this.afAuth.authState.pipe(
    switchMap((user) => {
      if (user) {
        return this.userService.getUserByID(user.uid);
      } else {
        return of(null);
      }
    })
  );

  user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {
    this.user$.subscribe((user) => (this.user = user));
  }

  login(): Promise<auth.UserCredential> {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
