import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-thing-card',
  templateUrl: './thing-card.component.html',
  styleUrls: ['./thing-card.component.scss'],
})
export class ThingCardComponent implements OnInit {
  @Input() thing: ThingWithUser;

  constructor(
    private thingService: ThingService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {}

  user$: Observable<User> = this.userService.user$.pipe(
    tap(async (user) => {
      this.isLiked = await this.thingService.isLiked(user?.uid, this.thing.id);
    })
  );

  //It take time to delete data from Algolia.
  //Component is invisible After dialog closed
  deleted: boolean;
  isLiked: boolean;
  isProcessing: boolean;

  async likeThing(thing: Thing): Promise<void> {
    this.isProcessing = true;
    const user: User = await this.userService.passUserWhenRequiredForm();
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    this.thing.likeCount++;
    this.isLiked = true;

    return this.thingService
      .likeThing(thing, user.uid)
      .finally(() => (this.isProcessing = false));
  }

  unLikeThing(thingId: string): Promise<void> {
    const uid: string = this.userService.uid;
    this.thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thingId, uid);
  }

  delete(thing: Thing) {
    this.dialog
      .open(DeleteDialogComponent, {
        data: thing,
        restoreFocus: false,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((status) => {
        if (status) {
          this.deleted = true;
        }
      });
  }

  navigateToProfile(thing: Thing) {
    this.router.navigate(['/mypage', thing.designerId]);
  }
}
