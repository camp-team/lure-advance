import { Component, OnInit, Input } from '@angular/core';
import { Thing } from 'src/app/interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thing-detail',
  templateUrl: './thing-detail.component.html',
  styleUrls: ['./thing-detail.component.scss'],
})
export class ThingDetailComponent implements OnInit {
  thing$: Observable<Thing>;
  navLinks = [
    {
      path: 'description',
      label: 'Description',
    },
    {
      path: 'comments',
      label: 'Comments',
    },
    {
      path: 'files',
      label: 'Files',
    },
  ];

  constructor(
    private thingService: ThingService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((map) => {
      const thingId = map.get('thing');
      this.thing$ = this.thingService.getThingByID(thingId);
    });
  }

  ngOnInit(): void {}
}
