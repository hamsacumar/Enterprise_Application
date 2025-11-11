import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsComponent implements OnInit {
  notifications = [
    {
      id: 1,
      title: 'Service Completed',
      message: 'Your oil change service for Toyota Camry has been completed successfully.',
      date: '2024-11-12',
      time: '2:30 PM',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Appointment Reminder',
      message: 'You have an upcoming service appointment on November 15, 2024 at 10:00 AM.',
      date: '2024-11-10',
      time: '9:00 AM',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of Rs. 2,000 for your recent service has been received.',
      date: '2024-11-08',
      time: '3:15 PM',
      type: 'success',
      read: true
    },
    {
      id: 4,
      title: 'Service Update',
      message: 'Your brake service is in progress. Estimated completion: 2 hours.',
      date: '2024-11-05',
      time: '11:00 AM',
      type: 'info',
      read: true
    },
    {
      id: 5,
      title: 'Vehicle Registration',
      message: 'Your new vehicle Honda Civic has been successfully registered.',
      date: '2024-11-01',
      time: '4:00 PM',
      type: 'success',
      read: true
    }
  ];

  ngOnInit(): void {
  }

  markAsRead(notification: any): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
