import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thing } from 'src/app/interfaces/thing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { DetailComponent } from '../detail/detail.component';
import { ScheduleComponent } from '../schedule/schedule.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @ViewChild(DetailComponent) detailComponent: DetailComponent;

  isEditable = false;
  detailFormGroup: FormGroup;
  scheduleFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private thingService: ThingService,
    private snackBar: MatSnackBar
  ) {
    this.detailFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(5000)]],
      tags: [this.detailComponent?.tags],
    });
    this.scheduleFormGroup = this.fb.group({
      setting: ['1', [Validators.required]],
      public: ['1_1'],
    });
  }

  create() {
    const detailValue = this.detailFormGroup.value;
    const userId = this.authService.uid;
    const thing: Omit<Thing, 'id' | 'designerId' | 'likeCount' | 'updateAt'> = {
      title: detailValue.title,
      description: detailValue.description,
      tags: detailValue.tags,
      filesUrls: ['https://placehold.jp/700x525.png'],
    };

    console.log(thing);
    this.thingService.createThing(thing, userId).then(() => {
      this.snackBar.open('アップロードに成功しました');
    });
  }
  ngOnInit() {}
}
