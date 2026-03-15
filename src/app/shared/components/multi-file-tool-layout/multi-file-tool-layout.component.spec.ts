import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFileToolLayoutComponent } from './multi-file-tool-layout.component';

describe('MultiFileToolLayoutComponent', () => {
  let component: MultiFileToolLayoutComponent;
  let fixture: ComponentFixture<MultiFileToolLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiFileToolLayoutComponent]
    });
    fixture = TestBed.createComponent(MultiFileToolLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
