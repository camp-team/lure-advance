import { Component, OnInit } from '@angular/core';
import { ThingWithUser } from '@interfaces/thing';
import { SearchService } from 'src/app/services/search.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private isInit = true;
  result: {
    nbHits: number;
    hits: any[];
  }; // TODO: 型対応後調整(https://github.com/algolia/algoliasearch-client-javascript/pull/1086)
  query: string;
  requestOptions: any = {}; // TODO: 型対応後調整(https://github.com/algolia/algoliasearch-client-javascript/pull/1086)
  createdAtFilter: string;
  tagFilter: string[];
  categoriFilter: string[];
  sort: string;
  loading: boolean;

  things: ThingWithUser[];
  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((map) => {
      this.things = [];
      this.query = map.get('searchQuery') || '';
      this.requestOptions = {
        page: 0,
        hitsPerPage: 6,
      };
      this.tagFilter = (map.get('tags') || '').split(',');
      this.categoriFilter = (map.get('categories') || '').split(',');
      this.sort = map.get('sort') || 'things';
      this.createdAtFilter = this.buidCreateAt(map.get('createdAt'));
      this.search();
      this.isInit = false;
    });
  }

  private search() {
    this.tagFilter = this.tagFilter.map((tag) => `tags:${tag}`);
    this.categoriFilter = this.categoriFilter.map(
      (category) => `category:${category}`
    );
    const searchiOptions = {
      ...this.requestOptions,
      facetFilters: [this.tagFilter, this.categoriFilter],
      filters: this.createdAtFilter,
    };
    this.loading = true;
    setTimeout(
      () => {
        this.searchService
          .searchThings(this.query, searchiOptions, this.sort)
          .then(async (result) => {
            const items = await result.pipe(take(1)).toPromise();
            this.things.push(...items);
          })
          .finally(() => (this.loading = false));
      },
      this.isInit ? 0 : 1000
    );
  }

  private buidCreateAt(key: string): string {
    const today = moment().valueOf();
    switch (key) {
      case 'today':
        const aday = moment().subtract(1, 'd').valueOf();
        return `createdAt:${aday} TO ${today}`;
      case 'week':
        const aweek = moment().subtract(7, 'd').valueOf();
        return `createdAt:${aweek} TO ${today}`;
      case 'month':
        const amonth = moment().subtract(30, 'd').valueOf();
        return `createdAt:${amonth} TO ${today}`;
      case 'year':
        const ayear = moment().subtract(365, 'd').valueOf();
        return `createdAt:${ayear} TO ${today}`;
      default:
        const from = moment().subtract(30, 'd').valueOf();
        return `createdAt:${from} TO ${today}`;
    }
  }

  onScroll() {
    this.requestOptions.page++;
    this.search();
  }
}
