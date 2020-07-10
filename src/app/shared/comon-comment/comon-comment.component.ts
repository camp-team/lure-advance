import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Comment, CommentWithUser } from '@interfaces/comment';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comon-comment',
  templateUrl: './comon-comment.component.html',
  styleUrls: ['./comon-comment.component.scss'],
})
export class ComonCommentComponent implements OnInit {
  @Input() rootCommentId: string;
  @Input() comment: CommentWithUser;
  @Input() thingId: string;
  @Input() isRootComment: boolean;
  @Input() isReplyComment: boolean;

  inputComment = new FormControl('', [
    Validators.required,
    Validators.maxLength(400),
  ]);
  replyCommentForm = new FormControl('', [
    Validators.required,
    ,
    Validators.maxLength(400),
  ]);

  isEditing: boolean;
  isReplying: boolean;

  isShowReplies: boolean;

  isProcessing: boolean;
  replyComments$: Observable<Comment[]>;

  user$: Observable<User> = this.userService.user$;

  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  alterEditMode(): void {
    this.isEditing = true;
    this.inputComment.setValue(this.comment.body);
  }

  async replyComment(): Promise<void> {
    this.isProcessing = true;
    const user = await this.userService.passUserWhenRequiredForm();
    const value: string = this.replyCommentForm.value;
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    const replyComment: Omit<Comment, 'id' | 'updateAt'> = {
      thingId: this.thingId,
      fromUid: user.uid,
      toUid: this.comment.fromUid,
      body: value,
      replyCount: 0,
    };
    this.commentService
      .replyComment(this.rootCommentId, replyComment)
      .then(() => this.snackBar.open('コメントに返信しました。'))
      .then(() => (this.isProcessing = false))
      .finally(() => this.replyCommentForm.setValue(''));
  }

  loadReplyComments(): void {
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
      thingId: this.thingId,
      body: this.inputComment.value,
    };
    //コメント
    if (this.rootCommentId === this.comment.id) {
      this.commentService
        .updateComment(newValue)
        .then(() => this.snackBar.open('コメントを編集しました。'));
      //返信
    } else {
      this.commentService
        .updateReply(this.rootCommentId, newValue)
        .then(() => this.snackBar.open('コメントを編集しました。'));
    }
  }

  getAavatarUrl(user: User) {
    return user?.avatarURL || 'assets/images/no_image.png';
  }

  deleteComment(): void {
    if (this.rootCommentId === this.comment.id) {
      this.commentService
        .deleteComment(this.comment)
        .then(() => this.snackBar.open('コメントを削除しました。'));
    } else {
      this.commentService
        .deleteReply(this.rootCommentId, this.comment)
        .then(() => this.snackBar.open('コメントを削除しました。'));
    }
  }

  ngOnInit(): void {}
}
