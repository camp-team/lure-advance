import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '@interfaces/user';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, first } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  uid: string;
  user$: Observable<User> = this.afAuth.authState.pipe(
    switchMap((user) => {
      if (user) {
        this.uid = user.uid;
        return this.getUserByID(this.uid);
      } else {
        return of(null);
      }
    })
  );

  async passUserWhenRequiredForm(): Promise<User> {
    const user = await this.getUserWithSnapShot();
    let isLoginDialogColesed: boolean;
    if (user) {
      return user;
    } else {
      await this.authService.login().catch((err) => {
        console.error(err);
        isLoginDialogColesed = true;
      });
      if (isLoginDialogColesed) {
        return null;
      }
      return await this.getUserWithSnapShot();
    }
  }

  getUserByID(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  getUserWithSnapShot(): Promise<User> {
    return this.user$.pipe(first()).toPromise();
  }

  updateUser(user: User): Promise<void> {
    return this.db.doc<User>(`users/${user.uid}`).update(user);
  }

  createUser(user: User): Promise<void> {
    return this.db.doc<User>(`users/${user.uid}`).set(user);
  }

  async uploadAvatarImage(avatarImage: Blob, uid: string): Promise<string> {
    const path: string = `users/${uid}/${'avatarImage'}`;
    await this.storage.upload(path, avatarImage);
    return this.storage.ref(path).getDownloadURL().toPromise();
  }
}
