import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsomationComponent } from './add-consomation.component';

describe('AddConsomationComponent', () => {
  let component: AddConsomationComponent;
  let fixture: ComponentFixture<AddConsomationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddConsomationComponent]
    });
    fixture = TestBed.createComponent(AddConsomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
