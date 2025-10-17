import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminreportPage } from './adminreport.page';

describe('AdminreportPage', () => {
  let component: AdminreportPage;
  let fixture: ComponentFixture<AdminreportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminreportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
