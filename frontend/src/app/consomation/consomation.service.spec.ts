import { TestBed } from '@angular/core/testing';

import { ConsomationService } from './consomation.service';

describe('ConsomationService', () => {
  let service: ConsomationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsomationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
