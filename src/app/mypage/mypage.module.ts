import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { AboutComponent } from './about/about.component';
import { DesignsComponent } from './designs/designs.component';
import { LikesComponent } from './likes/likes.component';
import { MypageComponent } from './mypage.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AboutComponent,
    DesignsComponent,
    LikesComponent,
    MypageComponent,
  ],
  imports: [CommonModule, MypageRoutingModule, MatTabsModule],
})
export class MypageModule {}
