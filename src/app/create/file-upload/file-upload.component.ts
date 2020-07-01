import { Component, OnInit, Input } from '@angular/core';
import { ThingService } from 'src/app/services/thing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThingRef } from '@interfaces/thing-ref';
import { FileUploadComponentService } from 'src/app/services/ui/file-upload-component.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() thingId: string;

  constructor(
    private thingService: ThingService,
    private componentService: FileUploadComponentService
  ) {}
  ngOnInit(): void {}

  images: any[] = this.componentService.images;
  imageFiles: (File | string)[] = this.componentService.imageFiles;

  stls: (string | ArrayBuffer)[] = this.componentService.stls;
  stlFiles: File[] = this.componentService.stlFiles;

  selectFiles(event) {
    const files: File[] = Object.values(event.target.files);
    this.componentService.selectFiles(files);
  }

  deleteImage(index: number) {
    this.componentService.deleteImage(index);
  }

  deleteStl(index: number) {
    this.componentService.deleteStl(index);
  }

  async uploadFiles() {
    return await this.thingService.saveThings(
      this.thingId,
      this.stlFiles,
      this.imageFiles
    );
  }

  uploadStlFiles(): Promise<ThingRef[]> {
    return this.thingService.uploadStlFiles(this.thingId, this.stlFiles);
  }
}
