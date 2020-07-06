import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { ThingRef } from '@interfaces/thing-ref';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-thing-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  MAX_FILE_LENGTH = 5;

  private thing: Thing;
  private subscriptin: Subscription;
  private thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingService.getThingByID(thingId);
    }),
    tap((thing) => {
      this.thing = thing;
    })
  );

  images: any[] = [];
  imageFiles: (File | string)[] = [];
  defaultImageLength: number;

  stls: (string | ArrayBuffer)[] = [];
  stlFiles: (File | ThingRef)[] = [];
  defaultStlLength: number;

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(5000)]],
    tags: [],
  });

  isCompleted: boolean;

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  categories: Category[];
  categoriesForm: FormGroup;
  selectedCategories: string[] = [];

  selectFiles(event) {
    const files: File[] = Object.values(event.target.files);
    if (files.length + this.images.length > this.MAX_FILE_LENGTH) {
      this.snackBar.open('最大ファイル数は5つです');
      return;
    }
    files.forEach((file) => this.readFile(file));
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

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private db: AngularFirestore,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    this.subscriptin.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptin = this.thing$.subscribe(async (thing) => {
      this.categoriesForm = await this.buidCategoriesForm(
        thing?.category || []
      );
      this.categoriesForm.valueChanges.subscribe((value) => {
        this.selectedCategories = this.toValuesFromSelected(value);
      });
      if (thing === undefined) {
        //+ボタン押下時
        return;
      }
      this.tags = thing.tags;
      this.form.patchValue({
        ...thing,
        tags: null,
      });

      this.images = [];
      this.imageFiles = [];
      this.images.push(...thing.imageUrls);
      this.imageFiles.push(...thing.imageUrls);
      this.defaultImageLength = thing.imageUrls.length;

      this.stls = [];
      this.stls.push(...thing.stlRef.map((ref) => ref.downloadUrl));
      this.stlFiles.push(...thing.stlRef);
      this.defaultStlLength = thing.stlRef.length;
    });
  }

  cancel() {
    const path = this.thing ? '/' + this.thing.id : '/';
    this.router.navigateByUrl(path);
  }

  async save() {
    const thingId: string = this.thing ? this.thing.id : this.db.createId();
    const res = await this.thingService.savenOnStorage(
      thingId,
      this.stlFiles,
      this.imageFiles,
      this.defaultImageLength,
      this.defaultStlLength
    );
    const formValue = this.form.value;
    const newValue: Thing = {
      ...this.thing,
      stlRef: res.stlRef,
      imageUrls: res.imageUrls,
      title: formValue.title,
      category: this.selectedCategories,
      description: formValue.description,
      tags: this.tags,
    };
    if (this.thing) {
      this.thingService.updateThing(newValue).then(() => {
        this.snackBar.open('保存しました');
        this.isCompleted = true;
        this.router.navigateByUrl(`/${this.thing.id}`);
      });
    } else {
      const uid = this.userService.uid;
      const thing: Omit<Thing, 'updateAt' | 'createdAt'> = {
        id: thingId,
        title: newValue.title,
        description: newValue.description,
        designerId: uid,
        imageUrls: res.imageUrls,
        stlRef: res.stlRef,
        category: newValue.category,
        commentCount: 0,
        likeCount: 0,
        viewCount: 0,
        tags: newValue.tags,
      };

      this.thingService.createThing(thing).then(() => {
        this.snackBar.open('アップロードに成功しました');
        this.isCompleted = true;
        this.router.navigateByUrl(`/${thingId}`);
      });
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

  private async buidCategoriesForm(values: string[]): Promise<FormGroup> {
    const result = await this.categoryService.getCategoriesLatest();
    this.categories = result;

    const formControls = {};
    this.categories.forEach(
      (category) =>
        (formControls[category.value] = values.includes(category.value))
    );

    return this.fb.group(formControls);
  }

  private toValuesFromSelected(selectedValue: any): string[] {
    return Object.entries(selectedValue)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = '作業中の内容が失われますがよろしいですか？';
    }
  }
}
