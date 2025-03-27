import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtelierComponent } from './atelier.component';

describe('AtelierComponent', () => {
  let component: AtelierComponent;
  let fixture: ComponentFixture<AtelierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtelierComponent]
    });
    fixture = TestBed.createComponent(AtelierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
