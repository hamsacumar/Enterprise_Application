import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private loginService: LoginService, private router: Router, private authService: AuthService) {}


  onLogin() {

    this.errorMessage = '';
    this.successMessage = '';

    this.loginService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Save token and user data in local storage
        this.successMessage = 'Login successful!';
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userRole', res.role);
        // Fetch user from CoreService so sidebar receives role immediately
        this.authService.getMeFromCore().subscribe({
          next: () => {},
          error: () => {}
        });
        localStorage.setItem('userId', res.userId);
        const role = res.role;
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'Worker') {
          this.router.navigate(['/worker-dashboard']);
        } else {
          this.router.navigate(['/user']);
        }
        setTimeout(() => {
          this.successMessage = '';
        }, 1000);
      },
      error: (err) => {
        if(err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else{
        this.errorMessage = err.error || 'Login failed. Please try again.';
      }
    
    
    setTimeout(() => {
      this.errorMessage = '';
    }, 5003);
  },



    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
