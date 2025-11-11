import { Component } from '@angular/core';
import { PaymentGatewayService } from '../../Services/payment-gateway.service';
import { PayHereParameters, PayHerePaymentRequest } from '../../Models/payhere.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-form',
  imports: [FormsModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent {

  paymentDetails: PayHerePaymentRequest = {
    amount: 1000.00, // Set a valid amount (minimum 100 LKR)
    itemName: 'Test Product',
    firstName: 'John',
    lastName: 'Doe',
    email: 'samanpriya1000@gmail.com', // Sandbox testing email
    phone: '0771234567',
    address: 'No. 123, Sample Road',
    city: 'Colombo',
    country: 'Sri Lanka'
  };

  constructor(private paymentService: PaymentGatewayService) {}

  validateForm(): boolean {
    // Validate amount (minimum 100 LKR)
    if (this.paymentDetails.amount < 100) {
      alert('Minimum amount is 100 LKR');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.paymentDetails.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Validate phone number (Sri Lankan format)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(this.paymentDetails.phone)) {
      alert('Please enter a valid Sri Lankan phone number');
      return false;
    }

    // Check for required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country'];
    for (const field of requiredFields) {
      if (!this.paymentDetails[field as keyof PayHerePaymentRequest]) {
        alert(`${field} is required`);
        return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    // Format amount to 2 decimal places before sending
    this.paymentDetails.amount = Number(this.paymentDetails.amount.toFixed(2));

    // 1. Call the backend to get the secure parameters and hash
    this.paymentService.initiatePayment(this.paymentDetails).subscribe({
      next: (params) => {
        // 2. Use the received parameters to redirect the user
        this.redirectToPayHere(params);
      },
      error: (err) => {
        console.error('Error initiating payment:', err);
        alert('Could not initiate payment. Please try again later.');
      }
    });
  }

  // CRITICAL STEP: Dynamic POST form submission with window.open
  redirectToPayHere(params: PayHereParameters): void {
    // Create a form in memory
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = params.sandboxUrl;
    form.target = '_blank'; // Open in new window/tab
    form.setAttribute('accept-charset', 'UTF-8');

    // Add all parameters as hidden fields
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'sandboxUrl') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    });

    // Temporarily add the form to the document
    document.body.appendChild(form);
    
    // Submit the form
    try {
      form.submit();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      // Clean up by removing the form
      document.body.removeChild(form);
    }
  }
}
