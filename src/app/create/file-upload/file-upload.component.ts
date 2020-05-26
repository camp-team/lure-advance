import { Component, OnInit, Input } from '@angular/core';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { ThingService } from 'src/app/services/thing.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() thingId: string;

  constructor(private thingService: ThingService) {}

  jobs: AngularFireUploadTask[] = [];
  files: File[];
  ngOnInit(): void {}

  selectFiles(event) {
    //TODO クロッピング
    this.files = Object.values(event.target.files);
  }

  uploadFiles() {
    this.thingService.uploadThings(this.thingId, this.files);
  }
}
