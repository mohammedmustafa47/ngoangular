import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmindonationPage } from './admindonation.page';

describe('AdmindonationPage', () => {
  let component: AdmindonationPage;
  let fixture: ComponentFixture<AdmindonationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmindonationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
