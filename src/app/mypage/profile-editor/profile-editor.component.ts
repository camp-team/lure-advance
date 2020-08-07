import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AvatarEditorComponent } from './avatar-editor/avatar-editor.component';

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
    private userService: UserService
  ) {}
  MAX_NAME_LENGTH: number = 40;
  MAX_DESCRIPTION_LENGTH: number = 150;
  MAX_URL_LENGTH: number = 100;

  user$: Observable<User> = this.userService.user$;

  form: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(this.MAX_NAME_LENGTH)],
    ],
    description: ['', [Validators.maxLength(this.MAX_DESCRIPTION_LENGTH)]],
    weblink: [
      '',
      [
        Validators.maxLength(this.MAX_URL_LENGTH),
        Validators.pattern(/https?:\/\/(www\.)?.+/),
      ],
    ],
  });

  ngOnInit(): void {
    this.user$.pipe(first()).subscribe((user) => {
      this.form.patchValue({
        name: user.name,
        description: user.description,
        weblink: user.weblink,
      });
    });
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get weblinkControl(): FormControl {
    return this.form.get('weblink') as FormControl;
  }

  save(user: User) {
    const formValue = this.form.value;
    const newValue: User = {
      ...user,
      name: formValue.name,
      description: formValue.description,
      weblink: formValue.weblink,
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
