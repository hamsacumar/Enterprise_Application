import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MockData } from '../../../../../../../autoserve/fe/src/app/services/mock-data';

@Component({
  selector: 'app-payment-details',
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './payment-details.html',
  styleUrl: './payment-details.css',
})
export class PaymentDetails {
  private mock = inject(MockData);
  data$ = this.mock.getPayments();
  displayedColumns = ['date','amount','method','status','invoice'];
}
