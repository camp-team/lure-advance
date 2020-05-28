import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<User> = this.authService.afUser$.pipe(
    switchMap((user) => {
      if (user) {
        return this.db.doc<User>(`users/${user.uid}`).valueChanges();
      }
      return of(null);
    })
  );

  constructor(private db: AngularFirestore, private authService: AuthService) {}

  getUserByID(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }
}
