import { Component, OnInit } from '@angular/core';
import { Thing } from 'src/app/interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-thing-detail',
  templateUrl: './thing-detail.component.html',
  styleUrls: ['./thing-detail.component.scss'],
})
export class ThingDetailComponent implements OnInit {
  thing$: Observable<Thing> = this.route.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingService.getThingByID(thingId);
    })
  );

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
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  delete(thing: Thing) {
    this.dialog.open(DeleteDialogComponent, {
      data: thing,
      restoreFocus: false,
    });
  }

  ngOnInit(): void {}
}
