import { Injectable, inject } from '@angular/core';
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
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const rawRole = localStorage.getItem('userRole') || localStorage.getItem('role') || '';

  const normalize = (r: string) => {
    const v = (r || '').toLowerCase();
    return v === 'user' ? 'customer' : v;
  };

  if (!token) {
    localStorage.setItem('redirectUrl', state.url);
    return router.parseUrl('/login');
  }

  const requiredRole = route.data?.['role'] as string | undefined;
  if (requiredRole && normalize(rawRole) !== normalize(requiredRole)) {
    return router.parseUrl('/');
  }

  return true;
};

