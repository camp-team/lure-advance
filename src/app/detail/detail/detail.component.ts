import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Thing, ThingWithUser } from '@interfaces/thing';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
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
      this.isMypost = thing?.designerId === uid;
      this.thingService.incrementViewCount(thing);
    }),
    take(1)
  );
  isLoading: boolean;
  isMypost: boolean;
  index: number;
  config: SwiperConfigInterface = {
    loop: true,
    slidesPerView: 1,
    pagination: { clickable: true, el: '.pager' },
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
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    public categoryService: CategoryService
  ) {}

  delete(thing: Thing) {
    this.dialog.open(DeleteDialogComponent, {
      data: thing,
      restoreFocus: false,
      autoFocus: false,
    });
  }

  async likeThing(thing: Thing): Promise<void> {
    let uid: string = this.userService.uid;
    if (uid === undefined) {
      await this.authService
        .login()
        .then(() => this.snackBar.open('ログインしました'));
      const user = await this.userService.getUserWithSnapShot();
      uid = user.uid;
    }
    thing.likeCount++;
    this.isLiked = true;

    return this.thingService.likeThing(thing, uid);
  }

  unLikeThing(thing: Thing): Promise<void> {
    const uid: string = this.userService.uid;
    thing.likeCount--;
    this.isLiked = false;
    return this.thingService.unLikeThing(thing.id, uid);
  }

  navigateByTag(tag: string) {
    this.router.navigate([''], {
      queryParams: {
        tags: tag,
      },
    });
  }

  ngOnInit(): void {}
}
