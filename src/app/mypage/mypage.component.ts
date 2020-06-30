import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@interfaces/user';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
  user$: Observable<User> = this.authService.user$;

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
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  openEditor() {
    this.dialog.open(ProfileEditorComponent, {
      data: this.user$,
    });
  }

  imageCropped(event) {}
}
