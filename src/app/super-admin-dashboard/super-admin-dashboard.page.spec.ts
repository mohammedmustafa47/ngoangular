import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminDashboardPage } from './super-admin-dashboard.page';

describe('SuperAdminDashboardPage', () => {
  let component: SuperAdminDashboardPage;
  let fixture: ComponentFixture<SuperAdminDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
