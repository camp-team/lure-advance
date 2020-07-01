import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { ThingRef } from '@interfaces/thing-ref';
import { Category } from 'src/app/interfaces/category';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ThingService } from 'src/app/services/thing.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  MAX_FILE_LENGTH = 5;
  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(5000)]],
    tags: [],
  });

  isEditable = false;

  scheduleFormGroup: FormGroup;
  thingId: string;

  images: any[] = [];
  imageFiles: (File | string)[] = [];

  stls: (string | ArrayBuffer)[] = [];
  stlFiles: File[] = [];

  tags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  categories: Category[];
  categoriesForm: FormGroup;
  selectedCategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.thingId = this.db.createId();

    this.scheduleFormGroup = this.fb.group({
      setting: ['1', [Validators.required]],
      public: ['1_1'],
    });
  }

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  async create() {
    const res = await this.uploadFiles();
    const thingRef = await this.uploadStlFiles();
    const detailValue = this.form.value;
    const categoryValue = this.selectedCategories;
    const tags: string[] = this.tags;
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

  selectFiles(event) {
    const files: File[] = Object.values(event.target.files);
    if (files.length + this.images.length > this.MAX_FILE_LENGTH) {
      this.snackBar.open('最大ファイル数は5つです');
      return;
    }
    files.forEach((file) => this.readFile(file));
  }

  private readFile(file: File) {
    const fr: FileReader = new FileReader();
    fr.onload = (e) => {
      if (this.isStl(file)) {
        this.stlFiles.push(file);
        this.stls.push(e.target.result);
      } else {
        this.images.push(e.target.result);
        this.imageFiles.push(file);
      }
    };
    fr.readAsDataURL(file);
  }
  private isStl(file: File) {
    const fileName = file.name.toLocaleLowerCase();
    return fileName.endsWith('.stl');
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  deleteStl(index: number) {
    this.stls.splice(index, 1);
    this.stlFiles.splice(index, 1);
  }

  async uploadFiles() {
    return await this.thingService.saveThings(
      this.thingId,
      this.stlFiles,
      this.imageFiles
    );
  }

  uploadStlFiles(): Promise<ThingRef[]> {
    return this.thingService.uploadStlFiles(this.thingId, this.stlFiles);
  }
  private async buidCategoriesForm(values: string[] = []): Promise<FormGroup> {
    const result = await this.categoryService.getCategoriesLatest();
    this.categories = result;

    const formControls = {};
    this.categories.forEach(
      (category) => (formControls[category.value] = false)
    );

    return this.fb.group(formControls);
  }

  private toValuesFromSelected(selectedValue: any): string[] {
    return Object.entries(selectedValue)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
  }
  async ngOnInit() {
    this.categoriesForm = await this.buidCategoriesForm();
    this.categoriesForm.valueChanges.subscribe((value) => {
      this.selectedCategories = this.toValuesFromSelected(value);
    });
  }
}
