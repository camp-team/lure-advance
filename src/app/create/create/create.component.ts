import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thing } from 'src/app/interfaces/thing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { DetailComponent } from '../detail/detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @ViewChild(DetailComponent) detailComponent: DetailComponent;
  @ViewChild(FileUploadComponent) fileupComponent: FileUploadComponent;

  isEditable = false;
  detailFormGroup: FormGroup;
  scheduleFormGroup: FormGroup;
  thingId: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private db: AngularFirestore
  ) {
    this.thingId = this.db.createId();

    this.detailFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(5000)]],
      tags: [],
    });

    this.scheduleFormGroup = this.fb.group({
      setting: ['1', [Validators.required]],
      public: ['1_1'],
    });
  }

  uploadFiles() {
    this.fileupComponent.uploadFiles();
  }

  create(id: string) {
    const detailValue = this.detailFormGroup.value;
    const userId = this.authService.uid;
    const thing: Omit<Thing, 'updateAt' | 'fileUrls'> = {
      id,
      title: detailValue.title,
      description: detailValue.description,
      designerId: userId,
      commentCount: 0,
      likeCount: 0,
      tags: this.detailComponent.tags.map((x) => x.value),
    };

    this.thingService
      .createThing(thing)
      .then(() => this.snackBar.open('アップロードに成功しました'));
  }
  ngOnInit() {}
}
