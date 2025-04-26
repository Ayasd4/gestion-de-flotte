import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsommationStatComponent } from './consommation-stat.component';

describe('ConsommationStatComponent', () => {
  let component: ConsommationStatComponent;
  let fixture: ComponentFixture<ConsommationStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsommationStatComponent]
    });
    fixture = TestBed.createComponent(ConsommationStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
