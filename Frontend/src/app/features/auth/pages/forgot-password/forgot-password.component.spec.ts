import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let forgotPasswordService: jasmine.SpyObj<ForgotPasswordService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ForgotPasswordService', ['forgotPassword']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: ForgotPasswordService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    forgotPasswordService = TestBed.inject(ForgotPasswordService) as jasmine.SpyObj<ForgotPasswordService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set successMessage on API success', () => {
    forgotPasswordService.forgotPassword.and.returnValue(of({ message: 'OTP sent' }));
    component.email = 'test@example.com';
    component.onSubmit();
    expect(component.successMessage).toBe('OTP sent');
  });

  it('should set errorMessage on API failure', () => {
    forgotPasswordService.forgotPassword.and.returnValue(throwError(() => ({ error: 'Email not found' })));
    component.email = 'wrong@example.com';
    component.onSubmit();
    expect(component.errorMessage).toBe('Email not found');
  });
});
