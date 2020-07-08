import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ThingFileService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}
}
