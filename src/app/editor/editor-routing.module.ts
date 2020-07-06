import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { EditorGuard } from '../guard/editor.guard';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    canDeactivate: [EditorGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
