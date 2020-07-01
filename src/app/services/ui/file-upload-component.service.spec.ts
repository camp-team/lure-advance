import { TestBed } from '@angular/core/testing';

import { FileUploadComponentService } from './file-upload-component.service';

describe('FileUploadComponentService', () => {
  let service: FileUploadComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
