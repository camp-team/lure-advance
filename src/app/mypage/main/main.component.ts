import { Component, OnInit } from '@angular/core';
import { Thing } from '@interfaces/thing';
import { firestore } from 'firebase';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  def: Thing = {
    id: 'xxxx',
    designerId: 'xxxxxxxx',
    title: 'テスト投稿',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maxime amet, perspiciatis commodi at ut repudiandae eum dolore eos ea necessitatibus expedita saepe veniam velit laboriosam aliquam nulla alias vitae.',
    tags: ['ルアー', 'ミノー', 'トラウト'],
    imageUrls: ['https://placehold.jp/400x300.png'],
    stlRef: [],
    category: [],
    commentCount: 5,
    likeCount: 6,
    viewCount: 0,
    createdAt: firestore.Timestamp.now(),
    updateAt: firestore.Timestamp.now(),
  };

  data: Thing[] = new Array(5).fill(this.def);

  uid = this.userService.uid;
  latestPosts: Thing[] = this.data.slice(0, 2);
  //TODO データ準備 https://github.com/camp-team/lure-advance/issues/68
  //  this.thingService.getThingsLatestByDesignerID(this.uid);
  popularPosts: Thing[] = this.data.slice(0, 5);
  // this.thingService.getThingsOrderByLikeCount(this.uid);
  likedPosts: Thing[] = this.data.slice(0, 5);
  // this.thingService.getLikedThings(this.uid);
  constructor(
    private userService: UserService,
    private thingService: ThingService
  ) {}

  ngOnInit(): void {}
}
