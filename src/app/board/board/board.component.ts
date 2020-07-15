import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThingWithUser, Thing } from '@interfaces/thing';
import { firestore } from 'firebase';
import { take, switchMap } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '@interfaces/user';
import { CommentWithUser } from '@interfaces/comment';
import { CommentService } from 'src/app/services/comment.service';
import { Observable } from 'rxjs';
import { NotificationWithUserAndThing } from '@interfaces/notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
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

  isDetail: boolean;
  things: ThingWithUser[];
  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService,
    private commentService: CommentService
  ) {}

  user$: Observable<User> = this.userService.user$;

  comments$: Observable<CommentWithUser[]> = this.user$.pipe(
    switchMap((user) => {
      return this.commentService.getCommentsByDesignerId(user?.uid);
    })
  );

  notifications$: Observable<NotificationWithUserAndThing[]> = this.user$.pipe(
    switchMap((user) => {
      return this.notificationService.getNotificationsByUid(user?.uid);
    })
  );

  def: Thing = {
    id: 'xxxx',
    designerId: 'uidxxx',
    title: 'ほげほげほげほ',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi temporibus' +
      'inventore totam illum deleniti et velit! Quis doloribus velit laboriosam' +
      'delectus consequuntur voluptas modi nam? Temporibus voluptas dolore soluta' +
      'accusantium!category',
    tags: [''],
    imageUrls: [''],
    stlRef: [],
    category: [''],
    commentCount: 1,
    likeCount: 1,
    viewCount: 1,
    createdAt: firestore.Timestamp.now(),
    updateAt: firestore.Timestamp.now(),
  };
  dummy: Thing[] = new Array(50).fill(this.def);

  async ngOnInit(): Promise<void> {
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
