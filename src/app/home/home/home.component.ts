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
  container = document.getElementById('ht');
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
        hitsPerPage: 12,
      };
      this.tagFilter = (map.get('tags') || '').split(',');
      this.categoriFilter = (map.get('categories') || '').split(',');
      this.sort = map.get('sort') || 'things';
      this.createdAtFilter = this.searchService.buidCreateAt(
        map.get('createdAt')
      );
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
    this.searchService
      .searchThings(this.query, searchiOptions, this.sort, this.isInit)
      .then(async (result) => {
        const items = await result.pipe(take(1)).toPromise();
        this.things.push(...items);
      })
      .finally(() => (this.loading = false));
  }

  onScroll() {
    this.requestOptions.page++;
    this.search();
  }
}
