import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComonCommentComponent } from './comon-comment/comon-comment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivityComponent } from './activity/activity.component';
import { MatListModule } from '@angular/material/list';
import { NotifymsgPipe } from '../pipe/notifymsg.pipe';
import { ThingCardComponent } from './thing-card/thing-card.component';
import { RouterModule } from '@angular/router';
import { ThingCardSmComponent } from './thing-card-sm/thing-card-sm.component';
import { ThingCardWideComponent } from './thing-card-wide/thing-card-wide.component';
import { MatChipsModule } from '@angular/material/chips';
import { FilterComponent } from './filter/filter.component';
import { RelativetimePipe } from '../pipe/relativetime.pipe';

@NgModule({
  declarations: [
    ComonCommentComponent,
    ActivityComponent,
    NotifymsgPipe,
    ThingCardComponent,
    ThingCardSmComponent,
    ThingCardWideComponent,
    FilterComponent,
    RelativetimePipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatListModule,
    RouterModule,
    MatExpansionModule,
    MatChipsModule,
  ],
  exports: [
    ComonCommentComponent,
    ActivityComponent,
    ThingCardComponent,
    ThingCardSmComponent,
    ThingCardWideComponent,
    FilterComponent,
  ],
})
export class SharedModule {}
