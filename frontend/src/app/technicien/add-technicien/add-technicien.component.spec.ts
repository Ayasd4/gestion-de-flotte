import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnicienComponent } from './add-technicien.component';

describe('AddTechnicienComponent', () => {
  let component: AddTechnicienComponent;
  let fixture: ComponentFixture<AddTechnicienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTechnicienComponent]
    });
    fixture = TestBed.createComponent(AddTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
