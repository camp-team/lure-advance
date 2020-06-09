import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

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
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
