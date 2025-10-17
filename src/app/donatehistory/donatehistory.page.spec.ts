import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonatehistoryPage } from './donatehistory.page';

describe('DonatehistoryPage', () => {
  let component: DonatehistoryPage;
  let fixture: ComponentFixture<DonatehistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatehistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
