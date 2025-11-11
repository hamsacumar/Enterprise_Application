import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-details.html',
  styleUrls: ['./payment-details.css']
})
export class PaymentDetailsComponent implements OnInit {
  payments = [
    {
      id: 1,
      service: 'Oil Change',
      vehicle: 'Toyota Camry',
      date: '2024-11-12',
      amount: 2000,
      status: 'Paid',
      method: 'Credit Card',
      transactionId: 'TXN-123456789'
    },
    {
      id: 2,
      service: 'Car Wash',
      vehicle: 'Honda Civic',
      date: '2024-11-10',
      amount: 1000,
      status: 'Paid',
      method: 'Cash',
      transactionId: 'TXN-987654321'
    },
    {
      id: 3,
      service: 'Tire Replacement',
      vehicle: 'Nissan Altima',
      date: '2024-11-05',
      amount: 3500,
      status: 'Pending',
      method: 'Credit Card',
      transactionId: 'TXN-456789123'
    },
    {
      id: 4,
      service: 'Brake Service',
      vehicle: 'Toyota Camry',
      date: '2024-10-28',
      amount: 4000,
      status: 'Paid',
      method: 'Debit Card',
      transactionId: 'TXN-789123456'
    }
  ];

  totalPaid: number = 0;
  totalPending: number = 0;

  ngOnInit(): void {
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalPaid = this.payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    this.totalPending = this.payments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getStatusClass(status: string): string {
    return status === 'Paid' ? 'status-paid' : 'status-pending';
  }

  downloadReceipt(payment: any): void {
    console.log('Download receipt:', payment);
    alert('Receipt download functionality');
  }
}
