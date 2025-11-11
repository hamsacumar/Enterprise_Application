import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

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

  constructor(private loginService: LoginService, private router: Router) {}


  onLogin() {

    this.errorMessage = '';
    this.successMessage = '';

    this.loginService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Save token and user data in local storage
        this.successMessage = 'Login successful!';
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId);
        
        setTimeout(() => {
          this.successMessage = '';
        }, 1000);

        setTimeout(() => {
          // The backend sends role with first letter capitalized (e.g., 'Admin', 'Customer')
          const role = res.role;
          console.log('User role:', role); // For debugging
          
          if (role === 'Admin') {
            this.router.navigate(['/admin']); // Changed from '/Admin/dashboard' to '/admin'
          } else if (role === 'Worker') {
            this.router.navigate(['/worker']); // Update this if you have a worker route
          } else if (role === 'Customer') {
            this.router.navigate(['/user']); // Changed from '/User/dashboard' to '/user'
          }
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
