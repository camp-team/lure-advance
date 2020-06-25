import { Component, OnInit } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { ThingWithUser } from '@interfaces/thing';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  things: ThingWithUser[];
  constructor(private thingService: ThingService) {}
  async ngOnInit(): Promise<void> {
    this.things = await this.thingService.getThingsWithPromise();
  }
}
