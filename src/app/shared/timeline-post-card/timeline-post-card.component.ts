import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-timeline-card',
  templateUrl: './timeline-post-card.component.html',
  styleUrls: ['./timeline-post-card.component.scss'],
})
export class TimelinePostCardComponent implements OnInit {
  constructor(
    private thingService: ThingService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}
  @Input() thing: ThingWithUser;

  user$: Observable<User> = this.userService.user$.pipe(
    tap(async (user) => {
      this.isLiked = await this.thingService.isLiked(user?.uid, this.thing.id);
    })
  );

  ngOnInit(): void {}

  isLiked: boolean;
  isProcessing: boolean;

  async likeThing(): Promise<void> {
    this.isProcessing = true;
    const user: User = await this.userService.passUserWhenRequiredForm();
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    this.thing.likeCount++;
    this.isLiked = true;

    return this.thingService
      .likeThing(this.thing, user.uid)
      .finally(() => (this.isProcessing = false));
  }

  unLikeThing(): Promise<void> {
    const uid: string = this.userService.uid;
    this.thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(this.thing.id, uid);
  }

  delete(thing: Thing) {
    this.dialog.open(DeleteDialogComponent, {
      data: thing,
      restoreFocus: false,
      autoFocus: false,
    });
  }
}
