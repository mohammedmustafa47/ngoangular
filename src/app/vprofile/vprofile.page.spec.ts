import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VprofilePage } from './vprofile.page';

describe('VprofilePage', () => {
  let component: VprofilePage;
  let fixture: ComponentFixture<VprofilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
