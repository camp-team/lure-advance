import { Component, OnInit } from '@angular/core';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-thing-detail',
  templateUrl: './thing-detail.component.html',
  styleUrls: ['./thing-detail.component.scss'],
})
export class ThingDetailComponent implements OnInit {
  thing$: Observable<ThingWithUser> = this.route.paramMap.pipe(
    switchMap((map) =>
      this.thingService.getThingWithUserById(map.get('thing'))
    ),
    tap(async (thing) => {
      this.uid = this.authService.uid;
      this.isLiked = await this.thingService.isLiked(this.uid, thing.id);
    })
  );
  uid: string;
  index: number;
  config: SwiperConfigInterface = {
    loop: true,
    slidesPerView: 1,
    pagination: true,
    navigation: true,
    simulateTouch: false,
  };
  isLiked: boolean;

  navLinks = [
    {
      path: 'description',
      label: 'Description',
    },
    {
      path: 'comments',
      label: 'Comments',
    },
    {
      path: 'files',
      label: 'Files',
    },
  ];

  constructor(
    private thingService: ThingService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  delete(thing: Thing) {
    this.dialog.open(DeleteDialogComponent, {
      data: thing,
      restoreFocus: false,
      autoFocus: false,
    });
  }

  likeThing(thing: Thing): Promise<void> {
    const uid: string = this.authService.uid;
    if (!uid) {
      return;
    }
    thing.likeCount++;
    this.isLiked = true;

    return this.thingService.likeThing(thing, uid);
  }

  unLikeThing(thing: Thing): Promise<void> {
    const uid: string = this.authService.uid;
    if (!uid) {
      return;
    }
    thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thing.id, uid);
  }

  ngOnInit(): void {}
}
