import { Component, OnInit } from '@angular/core';
import { Thing } from '@interfaces/thing';
import { Observable } from 'rxjs';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
})
export class LikesComponent implements OnInit {
  constructor(
    private thingService: ThingService,
    private route: ActivatedRoute
  ) {}

  posts$: Observable<Thing[]> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const uid = map.get('uid');
      return this.thingService.getLikedThings(uid);
    })
  );

  ngOnInit(): void {}
}
