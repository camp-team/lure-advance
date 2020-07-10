import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '@interfaces/user';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    private fns: AngularFireFunctions,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async deleteUserAccount() {
    const callable = this.fns.httpsCallable('deleteAfUser');
    const user: User = await this.userService.getUserWithSnapShot();

    return callable(user)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open('ご利用ありがとうございました', null, {
          duration: 5000,
        });
      });
  }
  ngOnInit(): void {}
}
