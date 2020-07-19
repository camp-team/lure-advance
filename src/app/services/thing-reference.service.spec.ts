import { TestBed } from '@angular/core/testing';

import { ThingReferenceService } from './thing-reference.service';

describe('ThingReferenceService', () => {
  let service: ThingReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThingReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
