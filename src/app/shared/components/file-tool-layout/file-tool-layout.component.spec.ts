import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileToolLayoutComponent } from './file-tool-layout.component';

describe('FileToolLayoutComponent', () => {
  let component: FileToolLayoutComponent;
  let fixture: ComponentFixture<FileToolLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileToolLayoutComponent]
    });
    fixture = TestBed.createComponent(FileToolLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
