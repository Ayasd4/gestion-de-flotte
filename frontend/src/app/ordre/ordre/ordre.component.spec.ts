import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreComponent } from './ordre.component';

describe('OrdreComponent', () => {
  let component: OrdreComponent;
  let fixture: ComponentFixture<OrdreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdreComponent]
    });
    fixture = TestBed.createComponent(OrdreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
