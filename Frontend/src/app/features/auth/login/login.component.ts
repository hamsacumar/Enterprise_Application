import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  // Mock users matching backend
  mockUsers = [
    { email: 'admin@autowash.com', password: 'admin123', role: 'Admin' },
    { email: 'worker@autowash.com', password: 'worker123', role: 'Worker' },
    { email: 'user@autowash.com', password: 'user123', role: 'User' }
  ];

  constructor(private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call delay
    setTimeout(() => {
      const user = this.mockUsers.find(
        u => u.email === this.email && u.password === this.password
      );

      if (user) {
        // Store user info
        localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);

        // Redirect based on role
        this.isLoading = false;
        this.redirectByRole(user.role);
      } else {
        this.errorMessage = 'Invalid email or password';
        this.isLoading = false;
      }
    }, 500);
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/app/admin-dashboard']);
        break;
      case 'Worker':
        this.router.navigate(['/app/worker-dashboard']);
        break;
      case 'User':
      default:
        this.router.navigate(['/app/user-dashboard']);
        break;
    }
  }

  goToLanding(): void {
    this.router.navigate(['/']);
  }

  // Test login methods
  loginAsAdmin(): void {
    this.email = 'admin@autowash.com';
    this.password = 'admin123';
    this.login();
  }

  loginAsWorker(): void {
    this.email = 'worker@autowash.com';
    this.password = 'worker123';
    this.login();
  }

  loginAsUser(): void {
    this.email = 'user@autowash.com';
    this.password = 'user123';
    this.login();
  }
}
