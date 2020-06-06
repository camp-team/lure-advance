import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { DesignsComponent } from './designs/designs.component';
import { LikesComponent } from './likes/likes.component';
import { MypageComponent } from './mypage.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    DesignsComponent,
    LikesComponent,
    MypageComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    MypageRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class MypageModule {}
