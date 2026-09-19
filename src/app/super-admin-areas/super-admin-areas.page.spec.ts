import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminAreasPage } from './super-admin-areas.page';

describe('SuperAdminAreasPage', () => {
  let component: SuperAdminAreasPage;
  let fixture: ComponentFixture<SuperAdminAreasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminAreasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
