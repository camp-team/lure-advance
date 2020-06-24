import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '@interfaces/user';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getUserByID(uid: string): Observable<User> {
    return this.db.doc<User>(`users/${uid}`).valueChanges();
  }

  updateUser(user: User): Promise<void> {
    return this.db.doc<User>(`users/${user.uid}`).update(user);
  }

  createUser(user: User): Promise<void> {
    return this.db.doc<User>(`users/${user.uid}`).set(user);
  }

  mergeUser(user: User): Promise<void> {
    return this.db.doc<User>(`users/${user.uid}`).set(user, {
      merge: true,
    });
  }

  async uploadAvatarImage(avatarImage: Blob, uid: string): Promise<string> {
    const path: string = `users/${uid}/${'avatarImage'}`;
    await this.storage.upload(path, avatarImage);
    return this.storage.ref(path).getDownloadURL().toPromise();
  }
}
