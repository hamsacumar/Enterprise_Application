import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminEmail = '';
  recentActivities = [
    { id: 1, action: 'New booking created', user: 'John Smith', time: '2 hours ago' },
    { id: 2, action: 'Worker assigned to task', user: 'Sarah Johnson', time: '3 hours ago' },
    { id: 3, action: 'Service completed', user: 'Mike Chen', time: '4 hours ago' },
    { id: 4, action: 'New user registered', user: 'Emma Williams', time: '5 hours ago' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.adminEmail = localStorage.getItem('userEmail') || 'Admin';
  }

  viewUsers(): void {
    console.log('Viewing users...');
  }

  viewReports(): void {
    console.log('Viewing reports...');
  }

  manageWorkers(): void {
    console.log('Managing workers...');
  }
}

