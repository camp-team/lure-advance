import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThingEditorComponent } from './thing-editor/thing-editor.component';

const routes: Routes = [
  {
    path: '',
    component: ThingEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThingEditorRoutingModule {}
