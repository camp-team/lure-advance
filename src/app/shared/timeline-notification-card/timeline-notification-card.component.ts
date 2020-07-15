import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationWithUserAndThing } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-timeline-notification-card',
  templateUrl: './timeline-notification-card.component.html',
  styleUrls: ['./timeline-notification-card.component.scss'],
})
export class TimelineNotificationCardComponent implements OnInit {
  constructor(
    private thingService: ThingService,
    private userService: UserService,
    private router: Router
  ) {}
  @Input() notification: NotificationWithUserAndThing;

  user$: Observable<User> = this.userService.user$;

  ngOnInit(): void {}
}
