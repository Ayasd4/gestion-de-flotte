import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKilometrageComponent } from './add-kilometrage.component';

describe('AddKilometrageComponent', () => {
  let component: AddKilometrageComponent;
  let fixture: ComponentFixture<AddKilometrageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddKilometrageComponent]
    });
    fixture = TestBed.createComponent(AddKilometrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
