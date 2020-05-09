import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { AboutComponent } from './about/about.component';
import { DesignsComponent } from './designs/designs.component';
import { LikessComponent } from './likess/likess.component';


@NgModule({
  declarations: [AboutComponent, DesignsComponent, LikessComponent],
  imports: [
    CommonModule,
    MypageRoutingModule
  ]
})
export class MypageModule { }
