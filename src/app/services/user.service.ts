import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  getUserByID(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  getUserByIDonPromise(uid: string): Promise<User> {
    return this.db
      .doc<User>(`users/${uid}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }
}
