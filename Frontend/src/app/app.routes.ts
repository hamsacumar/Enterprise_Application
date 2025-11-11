import { Routes } from '@angular/router';
import { TestComponent } from './features/chat/test/test.component';
import { PaymentFormComponent } from './features/PaymentGateway/Components/payment-form/payment-form.component';
import { PaymentStatusComponent } from './features/PaymentGateway/Components/payment-status/payment-status.component';

export const routes: Routes = [
      { path: 'payment/success', component: PaymentStatusComponent }, // Handles RETURN_URL
      { path: 'payment/cancel', component: PaymentStatusComponent },
      { path: '', redirectTo: 'payment', pathMatch: 'full' },
      {path: 'payment', component: PaymentFormComponent}
];
