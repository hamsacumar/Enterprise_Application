import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router) {}

  canActivate: CanActivateFn = (route, state) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // If no token, redirect to login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if route requires specific role
    const requiredRole = route.data?.['role'];
    if (requiredRole && userRole !== requiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
}

// Standalone guard function
export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    localStorage.setItem('redirectUrl', state.url);
    window.location.href = '/login';
    return false;
  }

  const requiredRole = route.data?.['role'];
  if (requiredRole && userRole !== requiredRole) {
    window.location.href = '/unauthorized';
    return false;
  }

  return true;
};
