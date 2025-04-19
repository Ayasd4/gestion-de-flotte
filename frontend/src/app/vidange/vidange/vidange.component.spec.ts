import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidangeComponent } from './vidange.component';

describe('VidangeComponent', () => {
  let component: VidangeComponent;
  let fixture: ComponentFixture<VidangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VidangeComponent]
    });
    fixture = TestBed.createComponent(VidangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
