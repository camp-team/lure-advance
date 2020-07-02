import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { ThingService } from 'src/app/services/thing.service';

@Component({
  selector: 'app-thing-editor',
  templateUrl: './thing-editor.component.html',
  styleUrls: ['./thing-editor.component.scss'],
})
export class ThingEditorComponent implements OnInit {
  MAX_FILE_LENGTH = 5;
  thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingService.getThingByID(thingId);
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
    private categoryService: CategoryService
  ) {}

  async ngOnInit(): Promise<void> {
    this.thing$.subscribe(async (thing) => {
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

      this.categoriesForm = await this.buidCategoriesForm(thing.category);
      this.categoriesForm.valueChanges.subscribe((value) => {
        this.selectedCategories = this.toValuesFromSelected(value);
      });
    });
  }

  cancel(thing: Thing) {
    this.router.navigateByUrl('/' + thing.id);
  }

  async save(thing: Thing) {
    const res = await this.thingService.saveThings(
      thing.id,
      this.stlFiles,
      this.imageFiles,
      this.defaultImageLength,
      this.defaultStlLength
    );
    const formValue = this.form.value;
    const newValue: Thing = {
      ...thing,
      stlRef: res.stlRef,
      imageUrls: res.imageUrls,
      title: formValue.title,
      category: this.selectedCategories,
      description: formValue.description,
      tags: this.tags,
    };
    this.thingService.updateThing(newValue).then(() => {
      this.snackBar.open('保存しました。');
      this.router.navigateByUrl(`/${thing.id}`);
    });
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  deleteStl(index: number) {
    this.stls.splice(index, 1);
    this.stlFiles.splice(index, 1);
  }
  private async buidCategoriesForm(values: string[] = []): Promise<FormGroup> {
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
}
