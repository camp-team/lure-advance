import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Tag } from 'src/app/interfaces/tag';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(5000)]],
    tags: [],
  });

  categoriesForm: FormGroup;

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  categories: Category[];

  tags: Tag[] = [];
  selectedCategories: string[];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push({ value: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  private async buidCategoriesForm(): Promise<FormGroup> {
    const result = await this.categoryService.getCategoriesLatest();
    this.categories = result;
    const formControls = {};
    this.categories.forEach(
      (category) => (formControls[category.value] = false)
    );
    return this.fb.group(formControls);
  }

  async ngOnInit(): Promise<void> {
    this.categoriesForm = await this.buidCategoriesForm();
    this.categoriesForm.valueChanges.subscribe((value) => {
      this.selectedCategories = Object.entries(value)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
      console.log(this.selectedCategories);
    });
  }
}
