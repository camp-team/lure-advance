import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { ThingReference } from '@interfaces/thing-reference';
import { User } from '@interfaces/user';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';
import { switchMap, take, tap, first } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';
import { ThingReferenceService } from 'src/app/services/thing-reference.service';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-thing-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  thing$: Observable<ThingWithUser> = this.route.paramMap.pipe(
    switchMap((map) => {
      this.isLoading = true;
      return this.thingService.getThingWithUserById(map.get('thing'));
    }),
    tap(async (thing) => {
      this.isLoading = false;
      const uid = this.userService.uid;
      this.isLiked = await this.thingService.isLiked(uid, thing?.id);
      this.thingService.incrementViewCount(thing);
    }),
    take(1)
  );

  thingRef: ThingReference;
  private thingRef$: Observable<ThingReference> = this.route.paramMap.pipe(
    switchMap((map) => {
      return this.thingRefService.getThingRefById(map.get('thing'));
    })
  );

  user$: Observable<User> = this.userService.user$;

  isLoading: boolean;
  index: number;
  config: SwiperConfigInterface = {
    loop: true,
    slidesPerView: 1,
    pagination: { clickable: true, el: '.pager' },
    navigation: true,

    simulateTouch: false,
  };

  isLiked: boolean;
  isProcessing: boolean;
  navLinks = [
    {
      path: 'description',
      label: 'Description',
    },
    {
      path: 'comments',
      label: 'Comments',
    },
  ];

  constructor(
    private thingService: ThingService,
    private thingRefService: ThingReferenceService,
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    public categoryService: CategoryService
  ) {
    this.thingRef$.pipe(first()).subscribe((ref) => (this.thingRef = ref));
  }

  delete(thing: Thing) {
    this.dialog.open(DeleteDialogComponent, {
      data: thing,
      restoreFocus: false,
      autoFocus: false,
    });
  }

  async likeThing(thing: Thing): Promise<void> {
    this.isProcessing = true;
    const user: User = await this.userService.passUserWhenRequiredForm();
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    thing.likeCount++;
    this.isLiked = true;

    return this.thingService
      .likeThing(thing, user.uid)
      .finally(() => (this.isProcessing = false));
  }

  unLikeThing(thing: Thing): Promise<void> {
    const uid: string = this.userService.uid;
    thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thing.id, uid);
  }

  ngOnInit(): void {}
}
