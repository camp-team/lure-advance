import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/interfaces/comment';
import { firestore } from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  comment: Comment = {
    id: 'hogehoge',
    name: 'Taro Yamada',
    avatarURL: 'https://placehold.jp/40x40.png',
    updateAt: firestore.Timestamp.now(),
    body:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,' +
      'praesentium ullam. Deserunt cum ducimus delectus animi fuga voluptatum' +
      'libero pariatur perspiciatis aperiam voluptas reiciendis excepturi,' +
      'maxime porro odio. Dicta, harum?',
  };
  isEditing: boolean = false;

  comments: Comment[] = new Array(50).fill(this.comment);

  addComment(): Promise<void> {
    const comment: Comment = {
      id: 'hogehoge',
      name: 'Taro Yamada',
      avatarURL: 'https://placehold.jp/40x40.png',
      updateAt: firestore.Timestamp.now(),
      body: this.commentForm.value,
    };
    this.comments.unshift(comment);
    this.snackBar.open('コメントを追加しました。');
    return null;
  }

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}
}
