import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userEmail = '';
  recentBookings = [
    { id: 1, service: 'Car Wash', date: '2024-01-15', status: 'Completed', amount: '$50' },
    { id: 2, service: 'Detailing', date: '2024-01-12', status: 'Completed', amount: '$120' },
    { id: 3, service: 'Maintenance', date: '2024-01-10', status: 'In Progress', amount: '$85' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || 'User';
  }

  bookService(): void {
    console.log('Booking a service...');
  }
}

