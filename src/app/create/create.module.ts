import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRoutingModule } from './create-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DetailComponent } from './detail/detail.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ScheduleComponent } from './schedule/schedule.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CreateComponent } from './create/create.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatDividerModule } from '@angular/material/divider';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    DetailComponent,
    ScheduleComponent,
    CreateComponent,
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    CreateRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    StlModelViewerModule,
    MatCheckboxModule,
  ],
})
export class CreateModule {}
