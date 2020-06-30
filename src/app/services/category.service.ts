import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private db: AngularFirestore) {}

  getCategories(): Observable<Category[]> {
    return this.db.collection<Category>('categories').valueChanges();
  }

  getCategoriesLatest(): Promise<Category[]> {
    return this.getCategories().pipe(take(1)).toPromise();
  }
}
