import { Routes } from '@angular/router';
import { TestComponent } from './features/test/test.component';

export const routes: Routes = [
      { path: '', redirectTo: 'test', pathMatch: 'full' },
    { path: 'test', component: TestComponent }
];
