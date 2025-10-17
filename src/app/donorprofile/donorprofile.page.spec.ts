import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonorprofilePage } from './donorprofile.page';

describe('DonorprofilePage', () => {
  let component: DonorprofilePage;
  let fixture: ComponentFixture<DonorprofilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
