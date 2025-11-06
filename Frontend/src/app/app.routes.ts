import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { UserDashboardComponent } from './features/dashboard/user-dashboard/user-dashboard.component';
import { WorkerDashboardComponent } from './features/dashboard/worker-dashboard/worker-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { WorkerTasksComponent } from './features/dashboard/worker-tasks/worker-tasks.component';
import { authGuard } from './core/guards/auth.guard';
import { landingGuard } from './core/guards/landing.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Public routes (without layout/sidebar)
  // Landing guard redirects authenticated users to dashboard
  { path: '', component: LandingComponent, canActivate: [landingGuard] },
  { path: 'login', component: LoginComponent, canActivate: [landingGuard] },
  { path: 'services', component: LandingComponent },
  { path: 'pricing', component: LandingComponent },
  { path: 'about', component: LandingComponent },
  { path: 'contact', component: LandingComponent },
  { path: 'booking', component: LandingComponent },

  // Protected Routes with MainLayout (shows sidebar)
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: UserDashboardComponent, data: { role: 'User' } },
      { path: 'user-dashboard', component: UserDashboardComponent, data: { role: 'User' } },
      { path: 'worker-dashboard', component: WorkerDashboardComponent, data: { role: 'Worker' } },
      { path: 'admin-dashboard', component: AdminDashboardComponent, data: { role: 'Admin' } },
      { 
        path: 'worker-tasks', 
        component: WorkerTasksComponent, 
        data: { role: 'Worker' } 
      },
      { 
        path: 'worker-tasks/:category', 
        component: WorkerTasksComponent, 
        data: { role: 'Worker' } 
      }
    ]
  },

  // Catch-all - redirect to app if authenticated, otherwise to landing
  { path: '**', redirectTo: '' }
];
