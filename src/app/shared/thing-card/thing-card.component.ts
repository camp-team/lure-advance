import { Component, OnInit, Input } from '@angular/core';
import { Thing, ThingWithUser } from 'src/app/interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-thing-card',
  templateUrl: './thing-card.component.html',
  styleUrls: ['./thing-card.component.scss'],
})
export class ThingCardComponent implements OnInit {
  @Input() thing: ThingWithUser;

  constructor(
    private thingService: ThingService,
    private authService: AuthService
  ) {
    if (this.uid) {
      this.thingService.getLikedThingIdsWithPromise(this.uid).then((res) => {
        this.likedThingsIds = res;
        this.isLiked = res.includes(this.thing.id);
      });
    }
  }

  uid: string = this.authService.uid;
  ngOnInit() {}

  likedThingsIds: string[] = [];
  isLiked: boolean;

  likeThing(thing: Thing): Promise<void> {
    if (!this.uid) {
      return;
    }
    this.thing.likeCount++;
    this.isLiked = true;
    return this.thingService.likeThing(thing, this.uid);
  }

  unLikeThing(thingId: string): Promise<void> {
    if (!this.uid) {
      return;
    }
    this.thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thingId, this.uid);
  }
}
