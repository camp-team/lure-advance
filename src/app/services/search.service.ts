import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch/lite';
import { UserService } from './user.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@interfaces/user';
import { ThingWithUser } from '@interfaces/thing';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.searchKey
);

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  index = {
    things: searchClient.initIndex('things'),
    views: searchClient.initIndex('things-desc-views'),
    comments: searchClient.initIndex('things-desc-comments'),
    likes: searchClient.initIndex('things-desc-likes'),
  };
  constructor(private userService: UserService) {}

  async searchThings(
    query: string,
    requestOptions,
    sortKey: string = 'things'
  ): Promise<Observable<ThingWithUser[]>> {
    const result = await this.index[sortKey].search(query, requestOptions);
    const items = result.hits as any[];
    const distinctIds: string[] = Array.from(
      new Set(items.map((item) => item.designerId))
    );
    const users: Observable<User>[] = distinctIds.map((uid) =>
      this.userService.getUserByID(uid)
    );

    const users$: Observable<User[]> = combineLatest(users);

    return combineLatest([of(items), users$]).pipe(
      map(([items, users]) => {
        return items.map((item) => {
          return {
            ...item,
            user: users.find((user) => user.uid === item.designerId),
          };
        });
      })
    );
  }
}
