import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comment, CommentWithUser } from 'src/app/interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/services/comment.service';

import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Thing } from 'src/app/interfaces/thing';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  commentForm = new FormControl('', [
    Validators.required,
    Validators.maxLength(400),
  ]);

  id: string;

  isEditing: boolean;

  user: User;

  comments$: Observable<CommentWithUser[]>;

  addComment(): void {
    const comment: Omit<Comment, 'id' | 'updateAt'> = {
      thingId: this.id,
      fromUid: this.user.uid,
      toUid: '',
      replyCount: 0,
      body: this.commentForm.value,
    };
    this.commentService
      .addComment(comment)
      .then(() => this.snackBar.open('コメントを追加しました。'))
      .finally(() => this.commentForm.setValue(''));
  }

  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.user$.subscribe((user) => (this.user = user));
    this.route.parent.paramMap.subscribe((map) => {
      this.id = map.get('thing');
      this.comments$ = this.commentService.getAllComments(this.id);
    });
  }

  ngOnInit(): void {}
}
