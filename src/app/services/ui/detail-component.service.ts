import { Injectable } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { CategoryService } from '../category.service';
import { Category } from 'src/app/interfaces/category';
import { MatChipInputEvent } from '@angular/material/chips';

@Injectable({
  providedIn: 'root',
})
export class DetailComponentService {
  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(5000)]],
    tags: [],
  });

  tags: string[] = [];
  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  categoriesForm: FormGroup;
  categories: Category[];
  selectedCategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.buidCategoriesForm().then((res) => {
      this.categoriesForm = res;
      this.categoriesForm.valueChanges.subscribe((value) => {
        this.selectedCategories = this.toValuesFromSelected(value);
      });
    });
  }

  toValuesFromSelected(selectedValue: any): string[] {
    return Object.entries(selectedValue)
      .filter(([_, value]) => selectedValue)
      .map(([key, _]) => key);
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

  addTag(event: MatChipInputEvent, tags: string[] = []): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: string, tags: string[] = []): void {
    const index = tags.indexOf(tag);

    if (index >= 0) {
      tags.splice(index, 1);
    }
  }
}
