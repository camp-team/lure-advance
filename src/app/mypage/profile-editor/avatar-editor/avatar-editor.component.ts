import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageTransform, ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { base64ToFile } from 'ngx-image-cropper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  styleUrls: ['./avatar-editor.component.scss'],
})
export class AvatarEditorComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public imageFile: File,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  user$: Observable<User> = this.authService.user$;

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
