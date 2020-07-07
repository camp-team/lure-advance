import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@interfaces/user';
import { Observable, combineLatest } from 'rxjs';
import { UserService } from '../services/user.service';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
  user$: Observable<User> = this.router.paramMap.pipe(
    switchMap((map) => {
      const designerId = map.get('uid');
      const designer$ = this.userService.getUserByID(designerId);
      const user$ = this.userService.user$;
      return combineLatest([designer$, user$]);
    }),
    tap(([designer, user]) => (this.isMypage = designer?.uid === user?.uid)),
    map(([designer, _]) => designer)
  );

  isMypage: boolean;

  navLinks = [
    {
      path: './',
      label: 'Main',
    },
    {
      path: 'designs',
      label: 'Designs',
    },

    {
      path: 'likes',
      label: 'Likes',
    },
  ];
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  openEditor() {
    this.dialog.open(ProfileEditorComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
