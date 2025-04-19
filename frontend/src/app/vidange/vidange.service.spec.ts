import { TestBed } from '@angular/core/testing';

import { VidangeService } from './vidange.service';

describe('VidangeService', () => {
  let service: VidangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VidangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
