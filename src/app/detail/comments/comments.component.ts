import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Comment, CommentWithUser } from '@interfaces/comment';
import { Thing } from '@interfaces/thing';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommentService } from 'src/app/services/comment.service';
import { ThingService } from 'src/app/services/thing.service';
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
    private thingService: ThingService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  MAX_COMMENT_LENGTH: number = 150;
  commentForm = new FormControl('', [
    Validators.required,
    Validators.maxLength(this.MAX_COMMENT_LENGTH),
  ]);

  id: string;
  isEditing: boolean;

  isProcessing: boolean;
  comments$: Observable<CommentWithUser[]> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      this.id = map.get('thing');
      return this.commentService.getCommentByThingId(this.id);
    })
  );

  thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      this.id = map.get('thing');
      return this.thingService.getThingByID(this.id);
    })
  );

  async addComment(thing: Thing): Promise<void> {
    this.isProcessing = true;
    const user = await this.userService.passUserWhenRequiredForm();
    if (user === null) {
      this.isProcessing = false;
      return;
    }
    const value: string = this.commentForm.value;
    const comment: Omit<Comment, 'id' | 'updateAt' | 'createdAt'> = {
      thingId: thing.id,
      designerId: thing.designerId,
      fromUid: user.uid,
      toUid: '',
      replyCount: 0,
      body: value.trim(),
    };
    this.commentService
      .addComment(comment)
      .then(() => this.snackBar.open('Added Your Comment.'))
      .then(() => (this.isProcessing = false))
      .finally(() => this.commentForm.setValue('', { emitEvent: false }));
  }

  ngOnInit(): void {}
}
