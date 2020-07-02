import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalComponent } from './footer/legal/legal.component';
import { PrivacypolicyComponent } from './footer/privacypolicy/privacypolicy.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
    path: 'intl/legal',
    component: LegalComponent,
  },
  {
    path: 'intl/privacypolicy',
    component: PrivacypolicyComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
