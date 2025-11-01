import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'services', component: LandingComponent },
  { path: 'pricing', component: LandingComponent },
  { path: 'about', component: LandingComponent },
  { path: 'contact', component: LandingComponent },
  { path: 'booking', component: LandingComponent },
  // Protected routes examples (add more as needed)
  // { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  // { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
