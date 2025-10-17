import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonordashboardPage } from './donordashboard.page';

describe('DonordashboardPage', () => {
  let component: DonordashboardPage;
  let fixture: ComponentFixture<DonordashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonordashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
