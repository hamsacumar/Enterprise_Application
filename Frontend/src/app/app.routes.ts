// ==========================
// 📦 Angular Core Imports
// ==========================
import { LandingComponent } from './features/landing/landing.component';
import { AboutComponent } from './features/pages/about/about.component';
//import { ContactComponent } from './features/pages/contact/contact.component';
import { ServicesComponent } from './features/pages/services/services.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { landingGuard } from './core/guards/landing.guard';

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
// 🛠️ ADMIN MODULE COMPONENTS
// ==========================
import { DashboardComponent } from './features/Admin/pages/dashboard/dashboard.component';
import { DashboardHomeComponent } from './features/Admin/pages/dashboard-home/dashboard-home.component';
import { ServiceListComponent } from './features/Admin/pages/service-list/service-list.component';
import { WorkerListComponent } from './features/Admin/pages/worker-list/worker-list.component';
import { OrderListComponent } from './features/Admin/pages/order-list/order-list.component';
import { CustomerListComponent } from './features/Admin/pages/customer-list/customer-list.component';

// ==========================
// 🤖 AI CHATBOT COMPONENT
// ==========================
import { ChatbotComponent } from './features/chatbot/chatbot.component';

// ==========================
// CHATBOX COMPONENT
// ==========================
import { ChatboxComponent } from './features/chatbox/components/chatbox/chatbox.component';

// ==========================
// 👤 USER DASHBOARD COMPONENTS
// ==========================
import { DashboardComponent as UserDashboardComponent } from './features/User/pages/dashboard/dashboard';
import { BookServiceComponent } from './features/User/pages/book-service/book-service';
import { PastOrdersComponent } from './features/User/pages/past-orders/past-orders';
import { RecentAppointmentsComponent } from './features/User/pages/recent-appointments/recent-appointments';
import { MyVehiclesComponent } from './features/User/pages/my-vehicles/my-vehicles';
import { PaymentDetailsComponent } from './features/User/pages/payment-details/payment-details';
import { NotificationsComponent } from './features/User/pages/notifications/notifications';
import { WorkerDashboardComponent } from './features/Worker/pages/worker-dashboard/worker-dashboard.component';

// ==========================
// 🚦 ROUTE CONFIGURATION
// ==========================
//import { Routes } from '@angular/router';
import { PaymentFormComponent } from './features/PaymentGateway/Components/payment-form/payment-form.component';
import { PaymentStatusComponent } from './features/PaymentGateway/Components/payment-status/payment-status.component';

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
  { path: 'services', component: ServicesComponent, title: 'AutoServeX | Services' },
  { path: 'pricing', component: LandingComponent, title: 'AutoServeX | Pricing' },
  { path: 'about', component: AboutComponent, title: 'AutoServeX | About Us' },
  //{ path: 'contact', component: ContactComponent, title: 'AutoServeX | Contact' },
  { path: 'booking', component: LandingComponent, title: 'AutoServeX | Booking' },

  // -------------------------------------
  // 🔹 ADMIN ROUTES
  // -------------------------------------
  {
    path: 'admin',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent, title: 'Admin | Dashboard Home' },
      { path: 'services', component: ServiceListComponent, title: 'Admin | Services' },
      { path: 'workers', component: WorkerListComponent, title: 'Admin | Workers' },
      { path: 'customers', component: CustomerListComponent, title: 'Admin | Customers' },
      { path: 'orders', component: OrderListComponent, title: 'Admin | Orders' },
    ],
  },

  // -------------------------------------
  // 🔹 AUTHENTICATION ROUTES
  // -------------------------------------
  // 🔹 Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'classify', component: ClassifyComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  

   // 🔹 AI chatbot
  { path: 'ai', component: ChatbotComponent },
  // 🔹 Chatbox
  { path: 'chat', component: ChatboxComponent },
  // worker
  {
    path: 'worker-dashboard',
    component: WorkerDashboardComponent,
    title: 'Worker | Dashboard',
  },

   // 🔹 User dashboard routes
  {
    path: 'user',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        title: 'AutoServeX | Dashboard',
      },
      {
        path: 'book-service',
        component: BookServiceComponent,
        title: 'AutoServeX | Book Service',
      },
      {
        path: 'my-vehicles',
        component: MyVehiclesComponent,
        title: 'AutoServeX | My Vehicles',
      },
      {
        path: 'recent-appointments',
        component: RecentAppointmentsComponent,
        title: 'AutoServeX | Recent Appointments',
      },
      {
        path: 'past-orders',
        component: PastOrdersComponent,
        title: 'AutoServeX | Past Orders',
      },
      {
        path: 'payment-details',
        component: PaymentDetailsComponent,
        title: 'AutoServeX | Payment Details',
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'AutoServeX | Notifications',
      },
      { path: 'payment/success', component: PaymentStatusComponent }, 
      { path: 'payment/cancel', component: PaymentStatusComponent },
      {path: 'payment', component: PaymentFormComponent},
    ],
  },


   // 👇 Wildcard must come LAST
  { path: '**', redirectTo: '/login' },
  
];

// // ==========================
// // 🚀 ROUTING MODULE
// // ==========================
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
      

