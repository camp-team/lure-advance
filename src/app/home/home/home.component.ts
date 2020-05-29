import { Component, OnInit } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { Thing } from 'src/app/interfaces/thing';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User;
  things: Thing[];
  likedThingsIds: string[];
  likeState = {};

  constructor(
    private thingService: ThingService,
    private userService: UserService
  ) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      this.thingService
        .getlikedThingIds(this.user.uid)
        .then((res) => (this.likedThingsIds = res));
    });

    //TODO アルゴリア連携
    this.thingService
      .getAllThings()
      .pipe(
        map((res) => res.map((item) => item)),
        take(1)
      )
      .toPromise()
      .then((res) => (this.things = res));
  }

  isMore: boolean;

  likeThing(thingId: string): Promise<void> {
    const index = this.things.findIndex((thing) => thing.id === thingId);
    this.things[index].likeCount++;
    this.likeState[thingId] = {
      isLike: true,
    };
    return this.thingService.likeThing(thingId, this.user.uid);
  }

  unLikeThing(thingId: string): Promise<void> {
    const index = this.things.findIndex((thing) => thing.id === thingId);
    this.things[index].likeCount--;
    this.likeState[thingId] = {
      isLike: false,
    };
    return this.thingService.unLikeThing(thingId, this.user.uid);
  }

  isLike(thingId: string): boolean {
    if (this.likeState[thingId]?.isLike) {
      return this.likeState[thingId].isLike;
    } else {
      return this.likedThingsIds?.includes(thingId);
    }
  }

  isUnlike(thingId: string): boolean {
    return !this.isLike(thingId);
  }

  ngOnInit(): void {}
}
