import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrdersComponent } from './update-orders.component';

describe('UpdateOrdersComponent', () => {
  let component: UpdateOrdersComponent;
  let fixture: ComponentFixture<UpdateOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateOrdersComponent]
    });
    fixture = TestBed.createComponent(UpdateOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
