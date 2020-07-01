import { TestBed } from '@angular/core/testing';

import { DetailComponentService } from './detail-component.service';

describe('DetailComponentService', () => {
  let service: DetailComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
