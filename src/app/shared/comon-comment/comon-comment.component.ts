import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comon-comment',
  templateUrl: './comon-comment.component.html',
  styleUrls: ['./comon-comment.component.scss'],
})
export class ComonCommentComponent implements OnInit {
  @Input() comment: Comment;

  isEditing: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  saveComment(): Promise<void> {
    this.isEditing = true;
    this.snackBar.open('コメントを編集しました。');
    return null;
  }

  delteComment(): Promise<void> {
    this.snackBar.open('コメントを削除しました。');
    return null;
  }

  ngOnInit(): void {}
}
