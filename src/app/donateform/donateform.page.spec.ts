import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonateformPage } from './donateform.page';

describe('DonateformPage', () => {
  let component: DonateformPage;
  let fixture: ComponentFixture<DonateformPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
