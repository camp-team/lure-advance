import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UrlPipe } from '../pipe/url.pipe';
import { SharedModule } from '../shared/shared.module';
import { DesignsComponent } from './designs/designs.component';
import { LikesComponent } from './likes/likes.component';
import { MainComponent } from './main/main.component';
import { MypageRoutingModule } from './mypage-routing.module';
import { MypageComponent } from './mypage.component';
import { AvatarEditorComponent } from './profile-editor/avatar-editor/avatar-editor.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';

@NgModule({
  declarations: [
    DesignsComponent,
    LikesComponent,
    MypageComponent,
    MainComponent,
    ProfileEditorComponent,
    AvatarEditorComponent,
    UrlPipe,
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
