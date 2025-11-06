import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Customer {
  username: string;
  email: string;
  carModel: string;
  licensePlate: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {

  customers: Customer[] = [
    {
      username: 'customer 1',
      email: 'worker1@gmail.com',
      carModel: 'Toyota Corolla',
      licensePlate: 'ABC-1234',
      phoneNumber: '+94 77 123 4567'
    },
    {
      username: 'customer2',
      email: 'customer2@gmail.com',
      carModel: 'Honda Civic',
      licensePlate: 'XYZ-5678',
      phoneNumber: '+94 76 987 6543'
    },
    {
      username: 'customer3',
      email: 'customer3@gmail.com',
      carModel: 'Nissan Sunny',
      licensePlate: 'JKL-4321',
      phoneNumber: '+94 71 555 8899'
    }
  ];

}
