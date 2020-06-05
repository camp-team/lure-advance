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
import { ActivityComponent } from './activity/activity.component';
import { MatListModule } from '@angular/material/list';
import { NotifymsgPipe } from '../pipe/notifymsg.pipe';

@NgModule({
  declarations: [ComonCommentComponent, ActivityComponent, NotifymsgPipe],
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
  ],
  exports: [ComonCommentComponent, ActivityComponent],
})
export class SharedModule {}
