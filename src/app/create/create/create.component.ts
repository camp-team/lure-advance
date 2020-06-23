import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thing } from 'src/app/interfaces/thing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { DetailComponent } from '../detail/detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @ViewChild(DetailComponent) detailComponent: DetailComponent;
  @ViewChild(FileUploadComponent) fileupComponent: FileUploadComponent;

  isEditable = false;
  detailFormGroup: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(5000)]],
    tags: [],
  });
  scheduleFormGroup: FormGroup;
  thingId: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.thingId = this.db.createId();

    this.scheduleFormGroup = this.fb.group({
      setting: ['1', [Validators.required]],
      public: ['1_1'],
    });
  }

  async create() {
    const res = await this.fileupComponent.uploadFiles();
    console.log();
    const detailValue = this.detailFormGroup.value;
    const uid = this.authService.uid;
    const thing: Omit<Thing, 'updateAt'> = {
      id: this.thingId,
      title: detailValue.title,
      description: detailValue.description,
      designerId: uid,
      imageUrls: res.imageUrls,
      stlUrls: res.stlUrls,
      commentCount: 0,
      likeCount: 0,
      tags: this.detailComponent.tags.map((x) => x.value),
    };

    this.thingService.createThing(thing).then(() => {
      this.snackBar.open('アップロードに成功しました');
      this.router.navigateByUrl(`/${this.thingId}`);
    });
  }
  ngOnInit() {}
}
