import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeStatComponent } from './vehicule-stat.component';

describe('VehiculeStatComponent', () => {
  let component: VehiculeStatComponent;
  let fixture: ComponentFixture<VehiculeStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiculeStatComponent]
    });
    fixture = TestBed.createComponent(VehiculeStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
