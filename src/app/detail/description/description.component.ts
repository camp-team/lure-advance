import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Thing } from '@interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private thingService: ThingService
  ) {}

  thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => this.thingService.getThingByID(map.get('thing')))
  );

  ngOnInit(): void {}
}
