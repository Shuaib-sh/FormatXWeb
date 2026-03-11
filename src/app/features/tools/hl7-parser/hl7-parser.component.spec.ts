import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hl7ParserComponent } from './hl7-parser.component';

describe('Hl7ParserComponent', () => {
  let component: Hl7ParserComponent;
  let fixture: ComponentFixture<Hl7ParserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Hl7ParserComponent]
    });
    fixture = TestBed.createComponent(Hl7ParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
