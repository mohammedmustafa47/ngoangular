import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VpickupPage } from './vpickup.page';

describe('VpickupPage', () => {
  let component: VpickupPage;
  let fixture: ComponentFixture<VpickupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VpickupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
