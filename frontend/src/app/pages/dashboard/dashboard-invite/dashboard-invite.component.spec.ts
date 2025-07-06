import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInviteComponent } from './dashboard-invite.component';

describe('DashboardInviteComponent', () => {
  let component: DashboardInviteComponent;
  let fixture: ComponentFixture<DashboardInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
