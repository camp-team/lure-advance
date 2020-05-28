import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comment, CommentWithUser } from 'src/app/interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
      uid: this.user.uid,
      body: this.commentForm.value,
    };
    this.commentService
      .addComment(this.id, comment)
      .then(() => this.snackBar.open('コメントを追加しました。'))
      .finally(() => this.commentForm.setValue(''));
  }

  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.userService.user$.subscribe((user) => (this.user = user));
    this.route.parent.paramMap.subscribe((map) => (this.id = map.get('thing')));
  }

  ngOnInit(): void {
    this.comments$ = this.commentService.getAllComments(this.id);
  }
}
