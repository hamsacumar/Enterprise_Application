import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { MockData } from '../../../../../../../autoserve/fe/src/app/services/mock-data';
=======
import { MockData } from '../../mock/mock-data';
>>>>>>> Stashed changes
=======
import { MockData } from '../../mock/mock-data';
>>>>>>> Stashed changes

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
