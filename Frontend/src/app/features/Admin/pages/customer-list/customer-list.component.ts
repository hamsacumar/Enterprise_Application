import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer, CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = []; // Initialize empty array

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getCustomer('Nirojiha').subscribe({
      next: (data) => {
        this.customers = [data]; // API returns a single customer, wrap in array
      },
      error: (err) => {
        console.error('Error fetching customer:', err);
      }
    });
  }
}
