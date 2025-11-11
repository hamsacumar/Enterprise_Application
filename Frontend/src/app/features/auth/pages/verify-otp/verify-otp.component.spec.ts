import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyOtpComponent } from './verify-otp.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { VerifyOtpService } from '../../services/verify-otp.service';
import { of, throwError } from 'rxjs';

describe('VerifyOtpComponent', () => {
  let component: VerifyOtpComponent;
  let fixture: ComponentFixture<VerifyOtpComponent>;
  let verifyOtpService: jasmine.SpyObj<VerifyOtpService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('VerifyOtpService', ['verifyOtp']);

    await TestBed.configureTestingModule({
      imports: [VerifyOtpComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: VerifyOtpService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyOtpComponent);
    component = fixture.componentInstance;
    verifyOtpService = TestBed.inject(VerifyOtpService) as jasmine.SpyObj<VerifyOtpService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set successMessage on OTP verification success', () => {
    verifyOtpService.verifyOtp.and.returnValue(of({ message: 'OTP verified' }));
    component.otpCode = '123456';
    component.onVerify();
    expect(component.successMessage).toBe('OTP verified');
  });

  it('should set errorMessage on OTP verification failure', () => {
    verifyOtpService.verifyOtp.and.returnValue(throwError(() => ({ error: 'Invalid OTP' })));
    component.otpCode = '000000';
    component.onVerify();
    expect(component.errorMessage).toBe('Invalid OTP');
  });
});
