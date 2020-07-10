import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalComponent } from './footer/legal/legal.component';
import { PrivacypolicyComponent } from './footer/privacypolicy/privacypolicy.component';
import { GuestGuard } from './guard/guest.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { ShellComponent } from './shell/shell.component';
import { IntlShellComponent } from './intl-shell/intl-shell.component';

const routes: Routes = [
  {
    path: '',
    component: IntlShellComponent,
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./editor/editor.module').then((m) => m.EditorModule),

        canActivate: [GuestGuard],
      },
      {
        path: ':thing',
        loadChildren: () =>
          import('./detail/detail.module').then((m) => m.DetailModule),
      },
      {
        path: ':thing/edit',
        loadChildren: () =>
          import('./editor/editor.module').then((m) => m.EditorModule),
        canActivate: [GuestGuard],
      },
      {
        path: 'mypage/:uid',
        loadChildren: () =>
          import('./mypage/mypage.module').then((m) => m.MypageModule),
      },
    ],
  },
  {
    path: '',
    component: IntlShellComponent,
    children: [
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
