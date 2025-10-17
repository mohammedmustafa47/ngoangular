import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminsuserPage } from './adminsuser.page';

describe('AdminsuserPage', () => {
  let component: AdminsuserPage;
  let fixture: ComponentFixture<AdminsuserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
