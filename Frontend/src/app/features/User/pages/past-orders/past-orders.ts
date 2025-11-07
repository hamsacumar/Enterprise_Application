import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MockData } from '../../../../services/mock-data';

@Component({
  selector: 'app-past-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './past-orders.html',
  styleUrl: './past-orders.css',
})
export class PastOrders {
  private mock = inject(MockData);
  past$ = this.mock.getPastOrders();
  displayedColumns = ['id','vehicle','type','completedOn'];
}
