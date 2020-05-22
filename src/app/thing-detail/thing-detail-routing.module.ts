import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThingDetailComponent } from './thing-detail/thing-detail.component';
import { DescriptionComponent } from './description/description.component';
import { CommentsComponent } from './comments/comments.component';
import { FilesComponent } from './files/files.component';

const routes: Routes = [
  {
    path: '',
    component: ThingDetailComponent,
    children: [
      {
        path: 'description',
        component: DescriptionComponent,
      },
      {
        path: 'comments',
        component: CommentsComponent,
      },
      {
        path: 'files',
        component: FilesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThingDetailRoutingModule {}
