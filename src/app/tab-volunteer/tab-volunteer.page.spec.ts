import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabVolunteerPage } from './tab-volunteer.page';

describe('TabVolunteerPage', () => {
  let component: TabVolunteerPage;
  let fixture: ComponentFixture<TabVolunteerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabVolunteerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
