import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afUser$: Observable<User> = this.afAuth.user;
  uid: string;

  constructor(private afAuth: AngularFireAuth) {
    this.afUser$.subscribe((user) => {
      this.uid = user && user.uid;
    });
  }

  login(): Promise<auth.UserCredential> {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
