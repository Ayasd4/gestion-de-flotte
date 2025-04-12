import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsomationComponent } from './consomation.component';

describe('ConsomationComponent', () => {
  let component: ConsomationComponent;
  let fixture: ComponentFixture<ConsomationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsomationComponent]
    });
    fixture = TestBed.createComponent(ConsomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
