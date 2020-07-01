import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThingEditorRoutingModule } from './thing-editor-routing.module';
import { ThingEditorComponent } from './thing-editor/thing-editor.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [ThingEditorComponent],
  imports: [
    CommonModule,
    ThingEditorRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    StlModelViewerModule,
    MatCheckboxModule,
  ],
})
export class ThingEditorModule {}
