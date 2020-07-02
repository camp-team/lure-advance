import { Component, OnInit, Input } from '@angular/core';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/thing-detail/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-thing-card',
  templateUrl: './thing-card.component.html',
  styleUrls: ['./thing-card.component.scss'],
})
export class ThingCardComponent implements OnInit {
  @Input() thing: ThingWithUser;

  constructor(
    private thingService: ThingService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.uid = this.authService.uid;
    this.isLiked = await this.thingService.isLiked(this.uid, this.thing.id);
  }
  uid: string;
  isLiked: boolean;

  async likeThing(thing: Thing): Promise<void> {
    let uid: string = this.authService.uid;
    if (uid === undefined) {
      this.authService
        .login()
        .then(() => this.snackBar.open('ログインしました'));
      return;
    }

    this.thing.likeCount++;
    this.isLiked = true;
    return this.thingService.likeThing(thing, uid);
  }

  unLikeThing(thingId: string): Promise<void> {
    const uid: string = this.authService.uid;
    this.thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thingId, uid);
  }

  delete(thing: Thing) {
    this.dialog.open(DeleteDialogComponent, {
      data: thing,
      restoreFocus: false,
      autoFocus: false,
    });
  }
}
