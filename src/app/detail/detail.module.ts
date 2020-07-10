import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SharedModule } from '../shared/shared.module';
import { CommentsComponent } from './comments/comments.component';
import { DescriptionComponent } from './description/description.component';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail/detail.component';
import { FilesComponent } from './files/files.component';

@NgModule({
  declarations: [
    DetailComponent,
    CommentsComponent,
    DescriptionComponent,
    FilesComponent,
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    SharedModule,
    MatTabsModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
    SwiperModule,
    StlModelViewerModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
})
export class DetailModule {}
