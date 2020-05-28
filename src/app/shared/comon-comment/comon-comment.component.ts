import { Component, OnInit, Input } from '@angular/core';
import { Comment, CommentWithUser } from 'src/app/interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from 'src/app/services/comment.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-comon-comment',
  templateUrl: './comon-comment.component.html',
  styleUrls: ['./comon-comment.component.scss'],
})
export class ComonCommentComponent implements OnInit {
  @Input() comment: CommentWithUser;
  @Input() thingId: string;

  inputComment = new FormControl('', Validators.maxLength(400));

  isEditing: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private commentService: CommentService
  ) {}

  alterEditMode(): void {
    this.isEditing = true;
    this.inputComment.setValue(this.comment.body);
  }

  saveComment(): void {
    this.isEditing = true;
    const newValue: Comment = {
      ...this.comment,
      body: this.inputComment.value,
    };
    this.commentService
      .updateComment(newValue, this.thingId)
      .then(() => this.snackBar.open('コメントを編集しました。'));
  }

  deleteComment(): void {
    this.commentService
      .deleteComment(this.comment, this.thingId)
      .then(() => this.snackBar.open('コメントを削除しました。'));
  }

  ngOnInit(): void {}
}
