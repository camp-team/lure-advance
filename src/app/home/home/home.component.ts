import { Component, OnInit } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { ThingWithUser } from 'src/app/interfaces/thing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private thingService: ThingService) {
    this.thingService.getThingsWithPromise().then((res) => (this.things = res));
  }
  ngOnInit(): void {}
  things: ThingWithUser[];
}
