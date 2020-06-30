import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thing } from '@interfaces/thing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { DetailComponent } from '../detail/detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, AfterViewInit {
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
    private db: AngularFirestore,
    private router: Router
  ) {
    this.thingId = this.db.createId();

    this.scheduleFormGroup = this.fb.group({
      setting: ['1', [Validators.required]],
      public: ['1_1'],
    });
  }

  ngAfterViewInit(): void {
    this.detailFormGroup = this.detailComponent.form;
    this.detailFormGroup.valueChanges.subscribe((value) => console.log(value));
  }

  async create() {
    const res = await this.fileupComponent.uploadFiles();
    const thingRef = await this.fileupComponent.uploadStlFiles();
    const detailValue = this.detailFormGroup.value;
    const categoryValue = this.detailComponent.selectedCategories;
    const uid = this.authService.uid;
    const thing: Omit<Thing, 'updateAt' | 'createdAt'> = {
      id: this.thingId,
      title: detailValue.title,
      description: detailValue.description,
      designerId: uid,
      imageUrls: res.imageUrls,
      stlRef: thingRef,
      category: categoryValue,
      commentCount: 0,
      likeCount: 0,
      viewCount: 0,
      tags: this.detailComponent.tags.map((x) => x.value),
    };

    this.thingService.createThing(thing).then(() => {
      this.snackBar.open('アップロードに成功しました');
      this.router.navigateByUrl(`/${this.thingId}`);
    });
  }
  ngOnInit() {}
}
