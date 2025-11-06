import { DashboardComponent } from './features/Admin/pages/dashboard/dashboard.component';
import { ServiceListComponent } from './features/Admin/pages/service-list/service-list.component';
import { DashboardHomeComponent } from './features/Admin/pages/dashboard-home/dashboard-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { VerifyOtpComponent } from './features/auth/pages/verify-otp/verify-otp.component';
import { ClassifyComponent } from './features/auth/pages/classify/classify.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';
import { ChatbotComponent } from './features/chatbot/chatbot.component';
import { WorkerListComponent } from './features/Admin/pages/worker-list/worker-list.component';
import { OrderListComponent } from './features/Admin/pages/order-list/order-list.component';  
import{CustomerListComponent} from './features/Admin/pages/customer-list/customer-list.component';
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'services', component: ServiceListComponent },
      { path: 'workers', component: WorkerListComponent },
      { path:'dashboard-home',component:DashboardHomeComponent},
     {path:'customers',component:CustomerListComponent},
       { path: 'orders', component: OrderListComponent }
    ]
  },
  //aichatbot 
  {
    path:'ai',
    component:ChatbotComponent
  },
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // { path: '**', redirectTo: 'dashboard' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
      { path: 'classify', component: ClassifyComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', redirectTo: '/login' } // Wildcard route


];
