import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ResetPasswordService } from '../../services/reset-password.service';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let resetPasswordService: jasmine.SpyObj<ResetPasswordService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ResetPasswordService', ['resetPassword']);

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: ResetPasswordService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    resetPasswordService = TestBed.inject(ResetPasswordService) as jasmine.SpyObj<ResetPasswordService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set successMessage on API success', () => {
    resetPasswordService.resetPassword.and.returnValue(of({ message: 'Password reset' }));
    component.email = 'test@example.com';
    component.otpCode = '123456';
    component.newPassword = 'NewPass@123';
    component.onSubmit();
    expect(component.successMessage).toBe('Password reset');
  });

  it('should set errorMessage on API failure', () => {
    resetPasswordService.resetPassword.and.returnValue(throwError(() => ({ error: 'Invalid OTP' })));
    component.email = 'test@example.com';
    component.otpCode = 'wrong';
    component.newPassword = 'NewPass@123';
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid OTP');
  });
});
