import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegalComponent } from './legal/legal.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },

  {
    path: ':thing',
    loadChildren: () =>
      import('./thing-detail/thing-detail.module').then(
        (m) => m.ThingDetailModule
      ),
  },
  {
    path: ':thing/edit',
    loadChildren: () =>
      import('./thing-editor/thing-editor.module').then(
        (m) => m.ThingEditorModule
      ),
  },
  {
    path: 'mypage/:uid',
    loadChildren: () =>
      import('./mypage/mypage.module').then((m) => m.MypageModule),
  },
  {
    path: 'mypage/:uid',
    loadChildren: () =>
      import('./mypage/mypage.module').then((m) => m.MypageModule),
  },
  {
    path: 'intl/legal',
    component: LegalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
