import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@interfaces/user';
import {
  base64ToFile,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  styleUrls: ['./avatar-editor.component.scss'],
})
export class AvatarEditorComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public imageFile: File,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  user$: Observable<User> = this.userService.user$;

  max: number = 100;
  min: number = 0;
  step: number = 1;

  transform: ImageTransform = {};

  croppedImage: string;
  ngOnInit(): void {}

  zoom(event: MatSliderChange) {
    this.transform = {
      ...this.transform,
      scale: 1 + event.value / 100,
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  async save(user: User): Promise<void> {
    const file: Blob = base64ToFile(this.croppedImage);
    const downloadUrl: string = await this.userService.uploadAvatarImage(
      file,
      user.uid
    );
    const newValue: User = {
      ...user,
      avatarURL: downloadUrl,
    };
    this.userService
      .updateUser(newValue)
      .then(() => this.snackBar.open('画像をアップロードしました'));
  }
}
