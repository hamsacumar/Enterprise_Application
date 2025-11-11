import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LandingGuardService {
  constructor(private router: Router) {}
}

// Landing Guard - allows all users to access the landing page
export const landingGuard: CanActivateFn = (route, state) => {
  // Allow all users (authenticated or not) to access the landing page
  return true;
};
