import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private forgotPasswordService: ForgotPasswordService, private router: Router) {}

  onSubmit() {
    this.forgotPasswordService.forgotPassword({ email: this.email }).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'OTP sent successfully!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/reset-password']), 2000); // Redirect to Reset Password
      },
      error: (err) => {
        this.errorMessage = err.error || 'Email not found.';
        this.successMessage = '';
      }
    });
  }
}
