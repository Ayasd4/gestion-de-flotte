import { TestBed } from '@angular/core/testing';

import { KilometrageService } from './kilometrage.service';

describe('KilometrageService', () => {
  let service: KilometrageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KilometrageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
