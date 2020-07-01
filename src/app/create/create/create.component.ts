import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thing } from '@interfaces/thing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingService } from 'src/app/services/thing.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Router } from '@angular/router';
import { DetailComponentService } from 'src/app/services/ui/detail-component.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, AfterViewInit {
  @ViewChild(FileUploadComponent) fileupComponent: FileUploadComponent;

  isEditable = false;
  detailForm: FormGroup = this.detailFormService.form;

  scheduleFormGroup: FormGroup;
  thingId: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private router: Router,
    private detailFormService: DetailComponentService
  ) {
    this.thingId = this.db.createId();

    this.scheduleFormGroup = this.fb.group({
      setting: ['1', [Validators.required]],
      public: ['1_1'],
    });
  }
  ngAfterViewInit(): void {}

  async create() {
    const res = await this.fileupComponent.uploadFiles();
    const thingRef = await this.fileupComponent.uploadStlFiles();
    const detailValue = this.detailForm.value;
    const categoryValue = this.detailFormService.selectedCategories;
    const tags: string[] = this.detailFormService.tags;
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
      tags,
    };

    this.thingService.createThing(thing).then(() => {
      this.snackBar.open('アップロードに成功しました');
      this.router.navigateByUrl(`/${this.thingId}`);
    });
  }
  ngOnInit() {}
}
