import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CreateComponent } from '../create/create/create.component';
import { SharedModule } from '../shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [BoardComponent, CreateComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MatSidenavModule,
    MatListModule,
    SharedModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDialogModule,
    StlModelViewerModule,
  ],
})
export class BoardModule {}
