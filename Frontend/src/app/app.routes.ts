// ==========================
// 📦 Angular Core Imports
// ==========================
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
// 👤 USER DASHBOARD COMPONENTS
// ==========================
import { Dashboard } from './features/User/pages/dashboard/dashboard';
import { BookService } from './features/User/pages/book-service/book-service';
import { Services } from './features/User/services/services';
import { PastOrders } from './features/User/pages/past-orders/past-orders';
import { MyVehicles } from './features/User/pages/my-vehicles/my-vehicles';
import { RequestModification } from './features/User/pages/request-modification/request-modification';
import { PaymentDetails } from './features/User/pages/payment-details/payment-details';
import { NotificationsPage } from './features/User/pages/notifications/notifications';

// ==========================
// 🚦 ROUTE CONFIGURATION
// ==========================
export const routes: Routes = [
  // -------------------------------------
  // 🔹 DEFAULT ROUTE
  // -------------------------------------
  { path: '', redirectTo: 'admin', pathMatch: 'full' },

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

   // 🔹 User dashboard routes
  {
    path: 'user',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'AutoServeX | Dashboard' },
      { path: 'book-service', component: BookService, title: 'AutoServeX | Book Service' },
      { path: 'services', component: Services, title: 'AutoServeX | My Bookings' },
      { path: 'my-vehicles', component: MyVehicles, title: 'AutoServeX | My Vehicles' },
      { path: 'past-orders', component: PastOrders, title: 'AutoServeX | Past Orders' },
      { path: 'request-modification', component: RequestModification, title: 'AutoServeX | Request Modification' },
      { path: 'payment-details', component: PaymentDetails, title: 'AutoServeX | Payment Details' },
      { path: 'notifications', component: NotificationsPage, title: 'AutoServeX | Notifications' },
    ],
  },

   // 👇 Wildcard must come LAST
  { path: '**', redirectTo: '/admin' },
  
];

// // ==========================
// // 🚀 ROUTING MODULE
// // ==========================
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}