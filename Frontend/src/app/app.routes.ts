import { Routes } from '@angular/router';
import { DashboardComponent } from './features/Admin/pages/dashboard/dashboard.component';
import { ServiceListComponent } from './features/Admin/pages/service-list/service-list.component';
import { DashboardHomeComponent } from './features/Admin/pages/dashboard-home/dashboard-home.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'services', component: ServiceListComponent },
      // future child routes:
      // { path: 'workers', component: WorkersComponent },
      // { path: 'orders', component: OrdersComponent }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
