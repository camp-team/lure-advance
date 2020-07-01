import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DetailComponentService } from 'src/app/services/ui/detail-component.service';
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

  categories: Category[];
  categoriesForm: FormGroup;
  selectedCategories: string[] = [];

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

  tags: string[] = [];

  add(event: MatChipInputEvent): void {
    this.componentService.addTag(event, this.tags);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  constructor(
    private componentService: DetailComponentService,
    private fb: FormBuilder,
    public categoryService: CategoryService
  ) {}

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

  async ngOnInit(): Promise<void> {
    this.categoriesForm = await this.buidCategoriesForm();
    this.categoriesForm.valueChanges.subscribe((value) => {
      this.selectedCategories = this.toValuesFromSelected(value);
    });
  }
}
