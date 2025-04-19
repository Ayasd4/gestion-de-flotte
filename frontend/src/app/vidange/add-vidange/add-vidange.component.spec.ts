import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVidangeComponent } from './add-vidange.component';

describe('AddVidangeComponent', () => {
  let component: AddVidangeComponent;
  let fixture: ComponentFixture<AddVidangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVidangeComponent]
    });
    fixture = TestBed.createComponent(AddVidangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
