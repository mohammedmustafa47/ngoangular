import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VdashboardPage } from './vdashboard.page';

describe('VdashboardPage', () => {
  let component: VdashboardPage;
  let fixture: ComponentFixture<VdashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VdashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
