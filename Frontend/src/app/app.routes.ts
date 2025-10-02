import { Routes } from '@angular/router';
import { TestComponent } from './features/Admin/test/test.component';

export const routes: Routes = [
      { path: '', redirectTo: 'test', pathMatch: 'full' },
      { path: 'test', component: TestComponent }
];
