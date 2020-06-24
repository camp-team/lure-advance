import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase';
import { Thing } from '@interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
})
export class LikesComponent implements OnInit {
  constructor(
    private thingService: ThingService,
    private authService: AuthService
  ) {}

  def: Thing = {
    id: 'xxxx',
    designerId: 'xxxxxxxx',
    title: 'テスト投稿',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maxime amet, perspiciatis commodi at ut repudiandae eum dolore eos ea necessitatibus expedita saepe veniam velit laboriosam aliquam nulla alias vitae.',
    tags: ['ルアー', 'ミノー', 'トラウト'],
    stlUrls: [],
    imageUrls: ['https://placehold.jp/400x300.png'],
    commentCount: 5,
    likeCount: 6,
    updateAt: firestore.Timestamp.now(),
  };

  uid: string = this.authService.uid;
  //TODO データ準備 https://github.com/camp-team/lure-advance/issues/68
  // this.thingService.getLikedThings(this.uid)
  posts: Thing[] = new Array(50).fill(this.def);

  ngOnInit(): void {}
}
