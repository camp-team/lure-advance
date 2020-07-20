import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Comment, CommentWithUser } from '@interfaces/comment';
import { Thing } from '@interfaces/thing';
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
  @Input() thing: Thing;
  @Input() isRootComment: boolean;
  @Input() isReplyComment: boolean;

  MAX_COMMENT_LENGTH: number = 150;

  inputComment = new FormControl('', [
    Validators.required,
    Validators.maxLength(this.MAX_COMMENT_LENGTH),
  ]);
  replyCommentForm = new FormControl('', [
    Validators.required,
    ,
    Validators.maxLength(this.MAX_COMMENT_LENGTH),
  ]);

  isEditing: boolean;
  isReplying: boolean;
  isLoadingReplies: boolean;

  isOpen: boolean;

  isProcessing: boolean;
  replyComments$: Observable<Comment[]>;

  staticCommentCount: number;

  user$: Observable<User> = this.userService.user$;

  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private userService: UserService
  ) {}

  alterEditMode(): void {
    this.isEditing = true;
    this.inputComment.setValue(this.comment.body);
  }

  async replyComment(thing: Thing): Promise<void> {
    this.isProcessing = true;
    const user = await this.userService.passUserWhenRequiredForm();
    const value: string = this.replyCommentForm.value;
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    const replyComment: Omit<Comment, 'id' | 'updateAt' | 'createdAt'> = {
      thingId: this.thing.id,
      designerId: thing.designerId,
      fromUid: user.uid,
      toUid: this.comment.fromUid,
      body: value,
      replyCount: 0,
    };
    this.commentService
      .replyComment(this.rootCommentId, replyComment)
      .then(() => this.snackBar.open('You Replied Comment.'))
      .then(() => (this.isProcessing = false))
      .then(() => this.staticCommentCount++)
      .finally(() => this.replyCommentForm.setValue(''));
  }

  loadReplyComments(): void {
    this.replyComments$ = this.commentService.getRepliesByCommentId(
      this.thing.id,
      this.rootCommentId
    );
    this.isOpen = true;
  }

  saveComment(): void {
    this.isEditing = true;
    const newValue: Comment = {
      ...this.comment,
      thingId: this.thing.id,
      body: this.inputComment.value,
    };
    //コメント
    if (this.rootCommentId === this.comment.id) {
      this.commentService
        .updateComment(newValue)
        .then(() => this.snackBar.open('Save your comment.'));
      //返信
    } else {
      this.commentService
        .updateReply(this.rootCommentId, newValue)
        .then(() => this.snackBar.open('Save your comment.'));
    }
  }

  getAavatarUrl(user: User) {
    return user?.avatarURL || 'assets/images/no_image.png';
  }

  deleteComment(): void {
    if (this.rootCommentId === this.comment.id) {
      this.commentService
        .deleteComment(this.comment)
        .then(() => this.snackBar.open('Deleting Comment is Successful.'));
    } else {
      this.commentService
        .deleteReply(this.rootCommentId, this.comment)
        .then(() => this.staticCommentCount--)
        .then(() => this.snackBar.open('Deleting Comment is Successful.'));
    }
  }

  ngOnInit(): void {
    this.staticCommentCount = this.comment.replyCount;
  }
}
