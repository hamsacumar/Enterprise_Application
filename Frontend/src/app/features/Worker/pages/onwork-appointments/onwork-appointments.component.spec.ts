import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnworkAppointmentsComponent } from './onwork-appointments.component';

describe('OnworkAppointmentsComponent', () => {
  let component: OnworkAppointmentsComponent;
  let fixture: ComponentFixture<OnworkAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnworkAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnworkAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
