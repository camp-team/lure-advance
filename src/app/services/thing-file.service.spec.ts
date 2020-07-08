import { TestBed } from '@angular/core/testing';

import { ThingFileService } from './thing-file.service';

describe('ThingFileService', () => {
  let service: ThingFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThingFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
