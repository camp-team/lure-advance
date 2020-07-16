import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentWithUserAndThing } from '@interfaces/comment';
import { Thing } from '@interfaces/thing';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-timeline-comments-card',
  templateUrl: './timeline-comments-card.component.html',
  styleUrls: ['./timeline-comments-card.component.scss'],
})
export class TimelineCommentsCardComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}
  @Input() comment: CommentWithUserAndThing;

  user$: Observable<User> = this.userService.user$;

  ngOnInit(): void {}

  isLiked: boolean;
  isProcessing: boolean;

  navigateToProfile(thing: Thing) {
    this.router.navigate(['/mypage', thing.designerId]);
  }
}
