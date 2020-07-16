import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    SharedModule,
  ],
})
export class TimelineModule {}
