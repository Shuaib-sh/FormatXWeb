import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightSearchComponent } from './spotlight-search.component';

describe('SpotlightSearchComponent', () => {
  let component: SpotlightSearchComponent;
  let fixture: ComponentFixture<SpotlightSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpotlightSearchComponent]
    });
    fixture = TestBed.createComponent(SpotlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
