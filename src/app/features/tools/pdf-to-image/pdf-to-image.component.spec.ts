import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfToImageComponent } from './pdf-to-image.component';

describe('PdfToImageComponent', () => {
  let component: PdfToImageComponent;
  let fixture: ComponentFixture<PdfToImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfToImageComponent]
    });
    fixture = TestBed.createComponent(PdfToImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
