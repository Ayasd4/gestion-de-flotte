import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatVidangeComponent } from './etat-vidange.component';

describe('EtatVidangeComponent', () => {
  let component: EtatVidangeComponent;
  let fixture: ComponentFixture<EtatVidangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtatVidangeComponent]
    });
    fixture = TestBed.createComponent(EtatVidangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
