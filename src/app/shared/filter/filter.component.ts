import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { FormControl } from '@angular/forms';
import { MatSelectionListChange, MatListOption } from '@angular/material/list';
import { Router, NavigationExtras } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  private index = this.searchService.index.things;
  uplaodAtFilter = new FormControl('');
  tags: {
    value: string;
    highlighted: string;
    count: number;
    selected?: boolean;
  }[];

  categories: Category[];

  visible: boolean;

  constructor(
    private searchService: SearchService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildTags();
    this.buildCategories();
  }

  private buildTags() {
    this.index.searchForFacetValues('tags', '').then((res) => {
      this.tags = res.facetHits.slice(0, 4);
    });
  }

  private buildCategories() {
    this.categoryService.getCategoriesLatest().then((res) => {
      this.categories = res;
    });
  }

  toggle() {
    this.visible = !this.visible;
  }

  buildQueryParameterByCreatedAt(event: MatSelectionListChange) {
    const key: MatListOption = event.source.selectedOptions.selected[0].value;
    this.router.navigate([''], {
      queryParams: {
        createdAt: key,
      },
      queryParamsHandling: 'merge',
    });
  }
  buildQueryParameterByTags(event: MatSelectionListChange) {
    const options: MatListOption[] = event.source.selectedOptions.selected;
    const tagsFileter = options.map((option) => option.value).join(',') || null;
    this.router.navigate([''], {
      queryParams: {
        tags: tagsFileter,
      },
      queryParamsHandling: 'merge',
    });
  }

  buildQueryParameterBySort(event: MatSelectionListChange) {
    const key: MatListOption = event.source.selectedOptions.selected[0].value;
    this.router.navigate([''], {
      queryParams: {
        sort: key,
      },
      queryParamsHandling: 'merge',
    });
  }
}
