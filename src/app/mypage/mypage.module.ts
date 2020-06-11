import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { DesignsComponent } from './designs/designs.component';
import { LikesComponent } from './likes/likes.component';
import { MypageComponent } from './mypage.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MainComponent } from './main/main.component';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../shared/shared.module';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AvatarEditorComponent } from './profile-editor/avatar-editor/avatar-editor.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    DesignsComponent,
    LikesComponent,
    MypageComponent,
    MainComponent,
    ProfileEditorComponent,
    AvatarEditorComponent,
  ],
  imports: [
    CommonModule,
    MypageRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    SharedModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    ImageCropperModule,
    MatSliderModule,
  ],
})
export class MypageModule {}
