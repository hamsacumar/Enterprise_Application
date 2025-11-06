import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';
  otpCode: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private resetPasswordService: ResetPasswordService, 
    private router: Router
  ) {}

  onSubmit() {
    this.resetPasswordService.resetPassword({
      email: this.email,
      otpCode: this.otpCode,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Password reset successfully!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to reset password. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
