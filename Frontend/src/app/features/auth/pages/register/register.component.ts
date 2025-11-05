import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/regiser.service';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, VerifyOtpComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showOtpModal = false;
  

  constructor(private registerService: RegisterService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.registerService
      .register({
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: (res) => {
          this.successMessage = res.message || 'OTP sent to email.';
          this.errorMessage = '';
          this.showOtpModal = true;
        },
        error: (err) => {
          this.errorMessage = err.error || 'Registration failed. Please try again.';
          this.successMessage = '';
        }
      });

  }

  closeOtpModal() {
    this.showOtpModal = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
