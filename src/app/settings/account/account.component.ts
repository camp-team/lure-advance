import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user$: Observable<User> = this.userService.user$;
  constructor(private userService: UserService, private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DeleteDialogComponent);
  }

  ngOnInit(): void {}
}
