import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comment, CommentWithUser } from '@interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs/operators';
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

  comments$: Observable<CommentWithUser[]> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      this.id = map.get('thing');
      return (this.comments$ = this.commentService.getAllComments(this.id));
    })
  );

  addComment(): void {
    const uid: string = this.authService.uid;
    if (uid === undefined) {
      return; //TODOガード対応
    }
    const comment: Omit<Comment, 'id' | 'updateAt'> = {
      thingId: this.id,
      fromUid: uid,
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
  ) {}

  ngOnInit(): void {}
}
