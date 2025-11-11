import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  imports: [FormsModule,CommonModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.css'
})
export class PaymentStatusComponent implements OnInit {

  status: 'success' | 'cancel' | 'pending' = 'pending';
  orderId: string | null = null;
  amount: string | null = null;
  
  // Note: For a production app, you would send the orderId to a backend API 
  // to get the *verified* status (from the IPN), not rely solely on URL params.

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    // Determine status based on the route URL
    if (this.route.snapshot.url.some(segment => segment.path === 'success')) {
      this.status = 'success';
    } else if (this.route.snapshot.url.some(segment => segment.path === 'cancel')) {
      this.status = 'cancel';
    }
    
    // Extract parameters from the URL PayHere redirects with
    this.route.queryParams.subscribe(params => {
      this.orderId = params['order_id'] || 'N/A';
      
      // PayHere typically sends status=2 for success on the return URL
      const statusCode = params['status_code'];

      if (this.status === 'success') {
          // You can perform a final client-side check if needed
          if (statusCode === '2') {
              this.amount = params['payhere_amount'] + ' ' + params['payhere_currency'];
          } else {
              // Handle case where PayHere redirects to success URL but reports failure (rare)
              this.status = 'pending'; // Treat as pending/unconfirmed until verified
          }
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/payment']); // Navigates to the root path
  }

}
