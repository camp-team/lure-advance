import { Component, OnInit } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { Thing, ThingWithUser } from 'src/app/interfaces/thing';
import { User } from 'src/app/interfaces/user';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User;
  things: ThingWithUser[];
  likedThingsIds: string[];
  likeState = {};

  constructor(
    private thingService: ThingService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (user) {
        this.thingService
          .getlikedThingIds(this.user.uid)
          .then((res) => (this.likedThingsIds = res));
      }
    });

    //TODO アルゴリア連携
    this.thingService
      .getThings()
      .pipe(
        map((res) => res.map((item) => item)),
        take(1)
      )
      .toPromise()
      .then((res) => (this.things = res));
  }

  isMore: boolean;

  likeThing(thing: Thing): Promise<void> {
    const index = this.things.findIndex((item) => thing.id === item.id);
    this.things[index].likeCount++;
    this.likeState[thing.id] = {
      isLike: true,
    };
    return this.thingService.likeThing(thing, this.user);
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
