import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
  navLinks = [
    {
      path: './',
      label: 'About',
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
  constructor() {}

  ngOnInit(): void {}
}
