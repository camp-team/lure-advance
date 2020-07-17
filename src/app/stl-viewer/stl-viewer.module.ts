import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StlViewerComponent } from './stl-viewer/stl-viewer.component';

@NgModule({
  declarations: [StlViewerComponent],
  imports: [CommonModule],
  exports: [StlViewerComponent],
})
export class StlViewerModule {}
