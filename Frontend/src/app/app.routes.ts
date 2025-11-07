import { Routes } from '@angular/router';

// ==========================
// 🌍 LANDING + LAYOUT COMPONENTS
// ==========================
import { LandingComponent } from './features/landing/landing.component';
import { AboutComponent } from './features/pages/about/about.component';
import { ContactComponent } from './features/pages/contact/contact.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// ==========================
// 🔐 AUTH MODULE COMPONENTS
// ==========================
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { VerifyOtpComponent } from './features/auth/pages/verify-otp/verify-otp.component';
import { ClassifyComponent } from './features/auth/pages/classify/classify.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';

// ==========================
// 👤 USER DASHBOARD COMPONENTS (COMMENTED OUT)
// ==========================
// import { UserDashboardComponent } from './features/dashboard/user-dashboard/user-dashboard.component';

// ==========================
// 👷 WORKER MODULE COMPONENTS (COMMENTED OUT)
// ==========================
// import { WorkerDashboardComponent } from './features/dashboard/worker-dashboard/worker-dashboard.component';
// import { WorkerTasksComponent } from './features/dashboard/worker-tasks/worker-tasks.component';

// ==========================
// 🛠️ ADMIN MODULE COMPONENTS
// ==========================
import { ServiceListComponent } from './features/Admin/pages/service-list/service-list.component';
import { WorkerListComponent } from './features/Admin/pages/worker-list/worker-list.component';
// import { DashboardComponent } from './features/Admin/pages/dashboard/dashboard.component';
// import { DashboardHomeComponent } from './features/Admin/pages/dashboard-home/dashboard-home.component';

// ==========================
// 🤖 AI CHATBOT COMPONENT
// ==========================
import { ChatbotComponent } from './features/chatbot/chatbot.component';

// ==========================
// 🛡️ GUARDS
// ==========================
import { authGuard } from './core/guards/auth.guard';
import { landingGuard } from './core/guards/landing.guard';

// ==========================
// 🚦 ROUTE CONFIGURATION
// ==========================
export const routes: Routes = [
  // =====================================
  // 🌍 PUBLIC / LANDING ROUTES
  // =====================================
  { path: '', component: LandingComponent, canActivate: [landingGuard] },
  { path: 'login', component: LoginComponent, canActivate: [landingGuard], title: 'AutoServeX | Login' },
  { path: 'register', component: RegisterComponent, title: 'AutoServeX | Register' },
  { path: 'verify-otp', component: VerifyOtpComponent, title: 'AutoServeX | Verify OTP' },
  { path: 'classify', component: ClassifyComponent, title: 'AutoServeX | Classify User' },
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'AutoServeX | Forgot Password' },
  { path: 'reset-password', component: ResetPasswordComponent, title: 'AutoServeX | Reset Password' },
  { path: 'services', component: LandingComponent, title: 'AutoServeX | Services' },
  { path: 'pricing', component: LandingComponent, title: 'AutoServeX | Pricing' },
  { path: 'about', component: AboutComponent, title: 'AutoServeX | About Us' },
  { path: 'contact', component: ContactComponent, title: 'AutoServeX | Contact' },
  { path: 'booking', component: LandingComponent, title: 'AutoServeX | Booking' },

  // =====================================
  // 🔒 PROTECTED ROUTES (with layout)
  // =====================================
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // 🔹 Default
      { path: '', redirectTo: 'services', pathMatch: 'full' },

      // 👤 USER ROUTES (COMMENTED OUT)
      // { path: 'dashboard', component: UserDashboardComponent, data: { role: 'User' }, title: 'AutoServeX | Dashboard' },
      // { path: 'user-dashboard', component: UserDashboardComponent, data: { role: 'User' }, title: 'AutoServeX | User Dashboard' },

      // 👷 WORKER ROUTES (COMMENTED OUT)
      // { path: 'worker-dashboard', component: WorkerDashboardComponent, data: { role: 'Worker' }, title: 'AutoServeX | Worker Dashboard' },
      // { path: 'worker-tasks', component: WorkerTasksComponent, data: { role: 'Worker' }, title: 'AutoServeX | Worker Tasks' },
      // { path: 'worker-tasks/:category', component: WorkerTasksComponent, data: { role: 'Worker' }, title: 'AutoServeX | Worker Tasks' },

      // 🧑‍💼 ADMIN ROUTES
      {
        path: 'admin',
        // component: DashboardComponent, (COMMENTED OUT)
        data: { role: 'Admin' },
        children: [
          { path: '', redirectTo: 'services', pathMatch: 'full' },
          // { path: 'dashboard', component: DashboardHomeComponent, title: 'Admin | Dashboard' }, (COMMENTED OUT)
          { path: 'services', component: ServiceListComponent, title: 'Admin | Services' },
          { path: 'workers', component: WorkerListComponent, title: 'Admin | Workers' },
        ],
      },
    ],
  },

  // =====================================
  // 🤖 CHATBOT ROUTE
  // =====================================
  { path: 'ai', component: ChatbotComponent, canActivate: [authGuard], title: 'AutoServeX | AI Chatbot' },

  // =====================================
  // 🔚 FALLBACK ROUTE
  // =====================================
  { path: '**', redirectTo: '/login' },
];
