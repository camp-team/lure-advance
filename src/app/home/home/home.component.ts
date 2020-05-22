import { Component, OnInit } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { Thing } from 'src/app/interfaces/thing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  things$: Observable<Thing[]>;
  constructor(private thingService: ThingService) {
    this.things$ = this.thingService.getAllThings();
  }

  isMore: boolean;

  ngOnInit(): void {}
}
