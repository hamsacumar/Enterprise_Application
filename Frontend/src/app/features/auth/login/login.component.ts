import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // Demo credentials display
  demoCredentials = [
    { role: 'Admin', email: 'admin@autowash.com', password: 'admin123' },
    { role: 'Worker', email: 'worker@autowash.com', password: 'worker123' },
    { role: 'User', email: 'user@autowash.com', password: 'user123' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.isLoading = false;
      }
    });
  }

  useDemoCredentials(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

