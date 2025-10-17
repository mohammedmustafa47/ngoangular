import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VhistoryPage } from './vhistory.page';

describe('VhistoryPage', () => {
  let component: VhistoryPage;
  let fixture: ComponentFixture<VhistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VhistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
