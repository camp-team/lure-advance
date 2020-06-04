import { Component, OnInit, Input } from '@angular/core';
import { Comment, CommentWithUser } from 'src/app/interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/services/comment.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comon-comment',
  templateUrl: './comon-comment.component.html',
  styleUrls: ['./comon-comment.component.scss'],
})
export class ComonCommentComponent implements OnInit {
  @Input() rootCommentId: string;
  @Input() comment: CommentWithUser;
  @Input() thingId: string;

  user: User;

  inputComment = new FormControl('', Validators.maxLength(400));
  replyCommentForm = new FormControl('', Validators.maxLength(400));

  isEditing: boolean;
  isReplying: boolean;

  isShowReplies: boolean;

  replyComments$: Observable<Comment[]>;

  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => (this.user = user));
  }

  alterEditMode(): void {
    this.isEditing = true;
    this.inputComment.setValue(this.comment.body);
  }

  replyComment(): void {
    const replyComment: Omit<Comment, 'id' | 'updateAt'> = {
      fromUid: this.user.uid,
      toUid: this.comment.fromUid,
      body: this.replyCommentForm.value,
      replyCount: 0,
    };
    this.commentService
      .replyComment(this.thingId, this.rootCommentId, replyComment)
      .then(() => this.snackBar.open('コメントに返信しました。'))
      .finally(() => this.replyCommentForm.setValue(''));
  }

  readReplyComments(): void {
    this.replyComments$ = this.commentService.getRepliesByCommentId(
      this.thingId,
      this.rootCommentId
    );
    this.isShowReplies = true;
  }

  saveComment(): void {
    this.isEditing = true;
    const newValue: Comment = {
      ...this.comment,
      body: this.inputComment.value,
    };
    //コメント
    if (this.rootCommentId === this.comment.id) {
      this.commentService
        .updateComment(newValue, this.thingId)
        .then(() => this.snackBar.open('コメントを編集しました。'));
      //返信
    } else {
      this.commentService
        .updateReply(this.rootCommentId, newValue, this.thingId)
        .then(() => this.snackBar.open('コメントを編集しました。'));
    }
  }

  deleteComment(): void {
    if (this.rootCommentId === this.comment.id) {
      this.commentService
        .deleteComment(this.comment, this.thingId)
        .then(() => this.snackBar.open('コメントを削除しました。'));
    } else {
      this.commentService
        .deleteReply(this.rootCommentId, this.comment, this.thingId)
        .then(() => this.snackBar.open('コメントを削除しました。'));
    }
  }

  ngOnInit(): void {}
}
