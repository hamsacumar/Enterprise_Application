import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
<<<<<<< Updated upstream
import { MockData } from '../../../../../../../autoserve/fe/src/app/services/mock-data';
=======
import { MockData } from '../../mock/mock-data';
>>>>>>> Stashed changes

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './payment-details.html',
  styleUrl: './payment-details.css',
})
export class PaymentDetails {
  private mock = inject(MockData);
  data$ = this.mock.getPayments();
  displayedColumns = ['date','amount','method','status','invoice'];
}
