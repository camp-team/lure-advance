import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThingDetailRoutingModule } from './thing-detail-routing.module';
import { ThingDetailComponent } from './thing-detail/thing-detail.component';
import { CommentsComponent } from './comments/comments.component';
import { DescriptionComponent } from './description/description.component';
import { FilesComponent } from './files/files.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ThingDetailComponent,
    CommentsComponent,
    DescriptionComponent,
    FilesComponent,
  ],
  imports: [
    CommonModule,
    ThingDetailRoutingModule,
    SharedModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
  ],
})
export class ThingDetailModule {}
