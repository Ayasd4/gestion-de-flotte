import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreStatComponent } from './ordre-stat.component';

describe('OrdreStatComponent', () => {
  let component: OrdreStatComponent;
  let fixture: ComponentFixture<OrdreStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdreStatComponent]
    });
    fixture = TestBed.createComponent(OrdreStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
