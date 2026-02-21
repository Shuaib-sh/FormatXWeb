import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolCardComponent } from './tool-card.component';

describe('ToolCardComponent', () => {
  let component: ToolCardComponent;
  let fixture: ComponentFixture<ToolCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolCardComponent]
    });
    fixture = TestBed.createComponent(ToolCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
