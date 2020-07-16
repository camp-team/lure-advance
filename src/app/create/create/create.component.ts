import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingRef } from '@interfaces/thing-ref';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  MAX_LENGTH: number = 300;
  MAX_TAG_LENGTH: number = 100;
  MAX_IMAGE_FILE_LENGTH: number = 4;
  MAX_STL_FILE_LENGTH: number = 1;

  images: any[] = [];
  imageFiles: (File | string)[] = [];
  defaultImageLength: number;

  stls: (string | ArrayBuffer)[] = [];
  stlFiles: (File | ThingRef)[] = [];
  defaultStlLength: number;

  form = this.fb.group({
    description: [
      '',
      [Validators.required, Validators.maxLength(this.MAX_LENGTH)],
    ],
    tags: [''],
  });

  tags: string[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  get descriptionCtrl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get tagsCtrl(): FormControl {
    return this.form.get('tags') as FormControl;
  }

  get tagsLength() {
    let length = 0;
    this.tags.forEach((tag) => (length += tag.length));
    return length;
  }

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  selectFiles(event) {
    const files: File[] = Object.values(event.target.files);
    const stlFileLength = files.filter((file) => this.isStl(file)).length;
    if (stlFileLength + this.stls.length > 1) {
      this.snackBar.open(
        `You can't attach more than ${this.MAX_STL_FILE_LENGTH} stl.`
      );
      return;
    }

    if (files.length + this.images.length > this.MAX_IMAGE_FILE_LENGTH) {
      this.snackBar.open(
        `You can't attach more than ${this.MAX_IMAGE_FILE_LENGTH} images.`
      );
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

  ngOnInit(): void {}
}
