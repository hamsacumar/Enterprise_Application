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
  const url = state.url;

  if (!token) {
    localStorage.setItem('redirectUrl', state.url);
    window.location.href = '/login';
    return false;
  }

  // Role-based redirect when hitting the layout root
  if (url === '/app' || url === '/app/') {
    if (userRole === 'Admin') {
      window.location.href = '/app/admin/services';
      return false;
    }
    // For Worker/User (routes not defined yet), stay at /app so layout + sidebar render
    // You can change these destinations when corresponding routes exist
    return true;
  }

  const requiredRole = route.data?.['role'];
  if (requiredRole && userRole !== requiredRole) {
    window.location.href = '/unauthorized';
    return false;
  }

  return true;
};