import { Injectable } from '@angular/core';
import { ThingWithUser } from '@interfaces/thing';
import { User } from '@interfaces/user';
import algoliasearch from 'algoliasearch/lite';
import { combineLatest, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import * as moment from 'moment';
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
    sortKey: string = 'things',
    isInit: boolean
  ): Promise<Observable<ThingWithUser[]>> {
    const result = await this.index[sortKey].search(query, requestOptions);
    const items = result.hits as any[];
    const distinctIds: string[] = Array.from(
      new Set(items.map((item) => item.designerId))
    );
    const userObservables$: Observable<User>[] = distinctIds.map((uid) =>
      this.userService.getUserByID(uid)
    );

    const users$: Observable<User[]> = combineLatest(userObservables$);

    return combineLatest([of(items), users$]).pipe(
      map(([items, users]) => {
        return items.map((item) => {
          return {
            ...item,
            user: users.find((user) => user.uid === item.designerId),
          };
        });
      }),
      delay(isInit ? 0 : 1000)
    );
  }

  buidCreateAt(key: string): string {
    const def: string = 'month';
    const rule = {
      today: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
    };
    const time = moment()
      .subtract(1, rule[key] || def)
      .valueOf();
    const today = moment().valueOf();
    return `createdAt:${time} TO ${today}`;
  }
}
