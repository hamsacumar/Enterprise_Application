import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ================= AUTH MODULE =================
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { VerifyOtpComponent } from './features/auth/pages/verify-otp/verify-otp.component';
import { ClassifyComponent } from './features/auth/pages/classify/classify.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';

// ================= ADMIN MODULE =================
import { DashboardComponent } from './features/Admin/pages/dashboard/dashboard.component';
import { DashboardHomeComponent } from './features/Admin/pages/dashboard-home/dashboard-home.component';
import { ServiceListComponent } from './features/Admin/pages/service-list/service-list.component';
import { WorkerListComponent } from './features/Admin/pages/worker-list/worker-list.component';

// ================= AI CHATBOT =================
import { ChatbotComponent } from './features/chatbot/chatbot.component';

// ================= USER DASHBOARD =================
import { Dashboard } from './features/User/pages/dashboard/dashboard';
import { BookService } from './features/User/pages/book-service/book-service';
import { Services } from './features/User/services/services';
import { PastOrders } from './features/User/pages/past-orders/past-orders';
import { MyVehicles } from './features/User/pages/my-vehicles/my-vehicles';
import { RequestModification } from './features/User/pages/request-modification/request-modification';
import { PaymentDetails } from './features/User/pages/payment-details/payment-details';
import { NotificationsPage } from './features/User/pages/notifications/notifications';

// ================= ROUTE CONFIG =================
export const routes: Routes = [
  // 🔹 Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔹 Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'classify', component: ClassifyComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // 🔹 Admin routes
  {
    path: 'admin',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'services', component: ServiceListComponent },
      { path: 'workers', component: WorkerListComponent },
    ],
  },

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

  // 🔹 Wildcard fallback
  { path: '**', redirectTo: '/login' },

  
      //( need to put guards for admin , customer , worker ) -- Hasini
];

// Optional if you’re using a routing module
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
