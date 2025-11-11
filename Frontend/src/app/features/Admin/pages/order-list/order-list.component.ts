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
  workerName: string;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchText = '';
  filterStatus = 'All';

  ngOnInit(): void {
    // Sample Sri Lankan-style data
    this.orders = [
      { id: '1', customerName: 'Kasun Perera', carModel: 'Toyota Corolla', serviceType: 'Oil Change', date: '2025-11-05', status: 'Pending', total: 120, workerName: 'Worker A' },
      { id: '2', customerName: 'Nimesha Silva', carModel: 'Honda Civic', serviceType: 'Full Service', date: '2025-11-03', status: 'Completed', total: 350, workerName: 'Worker B' },
      { id: '3', customerName: 'Dilan Fernando', carModel: 'Nissan Sunny', serviceType: 'Brake Repair', date: '2025-11-02', status: 'In Progress', total: 220, workerName: 'Worker C' },
      { id: '4', customerName: 'Tharindu Jayasuriya', carModel: 'Suzuki Alto', serviceType: 'Battery Replacement', date: '2025-11-01', status: 'Completed', total: 180, workerName: 'Worker D' },
      { id: '5', customerName: 'Sithara de Silva', carModel: 'Mazda 3', serviceType: 'Engine Tune-Up', date: '2025-10-30', status: 'Pending', total: 400, workerName: 'Worker E' },
      { id: '6', customerName: 'Ruwan Gamage', carModel: 'Kia Sportage', serviceType: 'Air Conditioning Repair', date: '2025-10-29', status: 'Completed', total: 550, workerName: 'Worker F' },
      { id: '7', customerName: 'Amali Perera', carModel: 'Hyundai Grand i10', serviceType: 'Tyre Replacement', date: '2025-10-27', status: 'In Progress', total: 260, workerName: 'Worker G' },
      { id: '8', customerName: 'Isuru Bandara', carModel: 'Mitsubishi Lancer', serviceType: 'Transmission Check', date: '2025-10-25', status: 'Completed', total: 480, workerName: 'Worker H' }
    ];
    this.filteredOrders = this.orders;
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(this.searchText.toLowerCase()) ||
                            order.carModel.toLowerCase().includes(this.searchText.toLowerCase()) ||
                            order.workerName.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.filterStatus === 'All' || order.status === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }
}
