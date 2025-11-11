import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VerifyOtpService } from '../../services/verify-otp.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  @Input() email!: string; // coming from Register component
  @Output() close = new EventEmitter<void>();

  otpCode = '';
  errorMessage = '';
  successMessage = '';
  countdown = 30;
  canResend = false;
  intervalId: any;

  constructor(private verifyOtpService: VerifyOtpService, private router: Router) {}

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.canResend = false;
    this.countdown = 60;

    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.canResend = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  onVerify() {
    this.verifyOtpService.verifyOtp({ otpCode: this.otpCode }).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'OTP verified successfully!';
        this.errorMessage = '';
        setTimeout(() => {
          this.close.emit(); // close modal
          this.router.navigate(['/classify']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Invalid or expired OTP. Please try again.';
        this.successMessage = '';

        setTimeout(() => {
          this.errorMessage = '';
        }, 1000);
      }
    });
  }

  onResendOtp() {
    if (!this.canResend) return;
    this.verifyOtpService.resendOtp({ Email: this.email }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.startCountdown();

        setTimeout(() => {
          this.successMessage = '';
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to resend OTP.';
        this.successMessage = '';

        setTimeout(() => {
          this.errorMessage = '';
        }, 1000);
      }
    });
  }
  
}
