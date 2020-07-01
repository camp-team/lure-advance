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
import { DetailComponentService } from 'src/app/services/ui/detail-component.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  form = this.componentService.form;

  // categories = this.componentService.categories;
  categoriesForm = this.componentService.categoriesForm;
  selectedCategories: string[] = this.componentService.selectedCategories;

  titleControl = this.componentService.titleControl;
  descriptionControl = this.componentService.descriptionControl;

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
    this.componentService.remove(tag, this.tags);
  }

  constructor(
    public categoryService: CategoryService,
    private componentService: DetailComponentService
  ) {}

  ngOnInit(): void {}
}
