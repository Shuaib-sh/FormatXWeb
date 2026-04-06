import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailShareModalComponent } from './email-share-modal.component';

describe('EmailShareModalComponent', () => {
  let component: EmailShareModalComponent;
  let fixture: ComponentFixture<EmailShareModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailShareModalComponent]
    });
    fixture = TestBed.createComponent(EmailShareModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
