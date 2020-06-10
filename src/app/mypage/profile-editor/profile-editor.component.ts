import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AvatarEditorComponent } from './avatar-editor/avatar-editor.component';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
})
export class ProfileEditorComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService
  ) {}

  user$: Observable<User> = this.authService.user$;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(40)]],
    myself: ['', [Validators.maxLength(150)]],
    myweb: ['', [Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.form.patchValue({
        name: user.name,
        myself: user.description,
        myweb: user.weblink,
      });
    });
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get myselfControl(): FormControl {
    return this.form.get('myself') as FormControl;
  }

  get mywebControl(): FormControl {
    return this.form.get('myweb') as FormControl;
  }

  save(user: User) {
    const formValue = this.form.value;
    const newValue: User = {
      ...user,
      description: formValue.myself,
      weblink: formValue.myweb,
    };
    this.userService
      .updateUser(newValue)
      .then(() => this.snackBar.open('プロフィールを更新しました'));
  }

  openAvatarEditor(event) {
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    const image: File = fileList[0];
    this.dialog.open(AvatarEditorComponent, {
      data: image,
    });
  }
}
