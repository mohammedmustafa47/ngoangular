import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabDonorPage } from './tab-donor.page';

describe('TabDonorPage', () => {
  let component: TabDonorPage;
  let fixture: ComponentFixture<TabDonorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDonorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
