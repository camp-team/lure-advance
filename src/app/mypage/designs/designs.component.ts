import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { Observable } from 'rxjs';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss'],
})
export class DesignsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private thingService: ThingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  posts$: Observable<Thing[]> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const uid = map.get('uid');
      return this.thingService.getThingsByDesignerID(uid);
    })
  );
}
