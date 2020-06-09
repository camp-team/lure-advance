import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignsComponent } from './designs/designs.component';
import { LikesComponent } from './likes/likes.component';
import { MypageComponent } from './mypage.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MypageComponent,
    children: [
      {
        path: 'designs',
        component: DesignsComponent,
      },
      {
        path: 'likes',
        component: LikesComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: MainComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypageRoutingModule {}
