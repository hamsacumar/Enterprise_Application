import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css']
})
export class WorkerDashboardComponent implements OnInit {
  workerEmail = '';
  assignedTasks = [
    { id: 1, customer: 'John Smith', service: 'Car Wash', time: '10:00 AM', status: 'Pending' },
    { id: 2, customer: 'Sarah Johnson', service: 'Detailing', time: '11:30 AM', status: 'In Progress' },
    { id: 3, customer: 'Mike Chen', service: 'Maintenance', time: '2:00 PM', status: 'Pending' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.workerEmail = localStorage.getItem('userEmail') || 'Worker';
  }

  startTask(taskId: number): void {
    console.log('Starting task:', taskId);
  }

  completeTask(taskId: number): void {
    console.log('Completing task:', taskId);
  }
}

