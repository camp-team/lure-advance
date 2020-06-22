import { Component, OnInit, Input } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() thingId: string;

  MAX_FILE_LENGTH = 5;
  constructor(
    private thingService: ThingService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}

  images: any[] = [];
  imageFiles: (File | string)[] = [];

  stls: (string | ArrayBuffer)[] = [];
  stlFiles: (File | string)[] = [];

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

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  deleteStl(index: number) {
    this.stls.splice(index, 1);
    this.stlFiles.splice(index, 1);
  }

  async uploadFiles() {
    return await this.thingService.uploadFiles(
      this.thingId,
      this.stlFiles,
      this.imageFiles
    );
  }
}
