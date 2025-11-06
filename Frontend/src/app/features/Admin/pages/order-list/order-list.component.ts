import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  customerName: string;
  carModel: string;
  serviceType: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  total: number;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrderListComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchText = '';
  filterStatus = 'All';

  ngOnInit(): void {
    // Later you'll fetch this data from backend
    this.orders = [
      { id: '1', customerName: 'John Doe', carModel: 'Toyota Corolla', serviceType: 'Oil Change', date: '2025-11-05', status: 'Pending', total: 120 },
      { id: '2', customerName: 'Jane Smith', carModel: 'Honda Civic', serviceType: 'Full Service', date: '2025-11-03', status: 'Completed', total: 350 },
      { id: '3', customerName: 'David Lee', carModel: 'Ford Focus', serviceType: 'Brake Repair', date: '2025-11-02', status: 'In Progress', total: 220 }
    ];
    this.filteredOrders = this.orders;
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(this.searchText.toLowerCase()) ||
                            order.carModel.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.filterStatus === 'All' || order.status === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }
}
