import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminPendingSignupsPage } from './super-admin-pending-signups.page';

describe('SuperAdminPendingSignupsPage', () => {
  let component: SuperAdminPendingSignupsPage;
  let fixture: ComponentFixture<SuperAdminPendingSignupsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPendingSignupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
