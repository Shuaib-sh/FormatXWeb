import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToPdfComponent } from './text-to-pdf.component';

describe('TextToPdfComponent', () => {
  let component: TextToPdfComponent;
  let fixture: ComponentFixture<TextToPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextToPdfComponent]
    });
    fixture = TestBed.createComponent(TextToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
