import { Component, OnInit } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { Thing } from 'src/app/interfaces/thing';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  things$: Observable<Thing[]> = this.thingService.getAllThings();
  user: User;
  likedThingsIds: string[];

  constructor(
    private thingService: ThingService,
    private userService: UserService
  ) {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.thingService
          .getlikedThingIds(this.user.uid)
          .then((res) => (this.likedThingsIds = res));
      }
    });
  }

  isMore: boolean;

  likeThing(thing: Thing): void {
    this.thingService.likeThing(thing.id, this.user.uid);
  }

  isLike(thingId: string): boolean {
    return this.likedThingsIds?.includes(thingId);
  }

  isUnlike(thingId: string): boolean {
    return !this.isLike(thingId);
  }

  ngOnInit(): void {}
}
