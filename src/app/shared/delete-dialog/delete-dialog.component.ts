import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { ThingService } from 'src/app/services/thing.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Thing,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.thingService.deleteThing(this.data).then(() => {
      this.snackBar.open('削除に成功しました。');
      this.router.navigateByUrl('/');
    });
  }
}
