import { Component, OnInit } from '@angular/core';
import { Thing } from 'src/app/interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss'],
})
export class DesignsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private thingService: ThingService
  ) {}

  ngOnInit(): void {}
  def: Thing = {
    id: 'xxxx',
    designerId: 'xxxxxxxx',
    title: 'テスト投稿',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maxime amet, perspiciatis commodi at ut repudiandae eum dolore eos ea necessitatibus expedita saepe veniam velit laboriosam aliquam nulla alias vitae.',
    tags: ['ルアー', 'ミノー', 'トラウト'],
    fileUrls: ['https://placehold.jp/700x525.png'],
    commentCount: 5,
    likeCount: 6,
    updateAt: firestore.Timestamp.now(),
  };

  uid: string = this.authService.uid;
  //TODO データ準備 https://github.com/camp-team/lure-advance/issues/68
  //this.thingService.getThingsByDesignerID(this.uid)
  posts: Thing[] = new Array(50).fill(this.def);
}
