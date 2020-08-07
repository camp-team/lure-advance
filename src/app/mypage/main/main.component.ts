import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ThingService } from 'src/app/services/thing.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private paramMap: Observable<ParamMap> = this.route.paramMap;
  latestPosts$: Observable<Thing[]> = this.paramMap.pipe(
    switchMap((map) => {
      const uid = map.get('uid');
      return this.thingService.getThingsLatestByDesignerID(uid);
    })
  );

  popularPosts$: Observable<Thing[]> = this.paramMap.pipe(
    switchMap((map) => {
      const uid = map.get('uid');
      return this.thingService.getThingsOrderByLikeCount(uid);
    })
  );

  likedPosts$: Observable<Thing[]> = this.paramMap.pipe(
    switchMap((map) => {
      const uid = map.get('uid');
      return this.thingService.getLikedThings(uid);
    })
  );

  constructor(
    private thingService: ThingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}
}
