import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { ThingEditorRoutingModule } from './thing-editor-routing.module';
import { ThingEditorComponent } from './thing-editor/thing-editor.component';

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
