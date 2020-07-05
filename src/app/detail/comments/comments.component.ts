import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Comment, CommentWithUser } from '@interfaces/comment';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  commentForm = new FormControl('', [
    Validators.required,
    Validators.maxLength(400),
  ]);

  id: string;
  isEditing: boolean;

  isProcessing: boolean;

  comments$: Observable<CommentWithUser[]> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      this.id = map.get('thing');
      return this.commentService.getAllComments(this.id);
    })
  );

  async addComment(): Promise<void> {
    this.isProcessing = true;
    const user = await this.userService.passUserWhenRequiredForm();
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    const comment: Omit<Comment, 'id' | 'updateAt'> = {
      thingId: this.id,
      fromUid: user.uid,
      toUid: '',
      replyCount: 0,
      body: this.commentForm.value,
    };
    this.commentService
      .addComment(comment)
      .then(() => this.snackBar.open('コメントを追加しました。'))
      .then(() => (this.isProcessing = false))
      .finally(() => this.commentForm.setValue('', { emitEvent: false }));
  }

  ngOnInit(): void {}
}
