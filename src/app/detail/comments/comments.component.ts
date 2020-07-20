import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
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
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  MAX_COMMENT_LENGTH: number = 150;

  form: FormGroup = this.fb.group({
    commentCtrl: [
      '',
      [Validators.required, Validators.maxLength(this.MAX_COMMENT_LENGTH)],
    ],
  });
  // commentCtrl = new FormControl('', [
  //   Validators.required,
  //   Validators.maxLength(this.MAX_COMMENT_LENGTH),
  // ]);

  get commentCtrl(): FormControl {
    return this.form.get('commentCtrl') as FormControl;
  }

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
    const value: string = this.commentCtrl.value;
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
      .finally(() => this.commentCtrl.setValue('', { emitEvent: false }));
  }

  ngOnInit(): void {}
}
