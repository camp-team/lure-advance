import { Component, OnInit, Input } from '@angular/core';
import { Thing, ThingWithUser } from '@interfaces/thing';
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
  ) {}

  async ngOnInit() {
    this.uid = this.authService.uid;
    this.isLiked = await this.thingService.isLiked(this.uid, this.thing.id);
  }

  uid: string;
  isLiked: boolean;

  likeThing(thing: Thing): Promise<void> {
    const uid: string = this.authService.uid;
    if (uid === undefined) {
      throw new Error('TODOガード設定');
    }
    this.thing.likeCount++;
    this.isLiked = true;

    return this.thingService.likeThing(thing, uid);
  }

  unLikeThing(thingId: string): Promise<void> {
    const uid: string = this.authService.uid;
    if (uid === undefined) {
      throw new Error('TODOガード設定');
    }
    this.thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thingId, uid);
  }
}
