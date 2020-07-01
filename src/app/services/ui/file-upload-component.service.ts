import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class FileUploadComponentService {
  MAX_FILE_LENGTH = 5;
  images: any[] = [];
  imageFiles: (File | string)[] = [];

  stls: (string | ArrayBuffer)[] = [];
  stlFiles: File[] = [];

  constructor(private snackBar: MatSnackBar) {}

  selectFiles(files: File[]) {
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

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  deleteStl(index: number) {
    this.stls.splice(index, 1);
    this.stlFiles.splice(index, 1);
  }
}
