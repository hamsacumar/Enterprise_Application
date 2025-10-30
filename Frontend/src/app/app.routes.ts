// import { Routes } from '@angular/router';
// import { TestComponent } from './features/Admin/test/test.component';

// export const routes: Routes = [
//       { path: '', redirectTo: 'test', pathMatch: 'full' },
//       { path: 'test', component: TestComponent }
// ];


import { Routes } from '@angular/router';
import { ServiceListComponent } from './features/Admin/pages/service-list/service-list.component'

export const routes: Routes = [
  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { path: 'services', component: ServiceListComponent }
];
