import { TestBed } from '@angular/core/testing';

import { NumparcService } from './numparc.service';

describe('NumparcService', () => {
  let service: NumparcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumparcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
