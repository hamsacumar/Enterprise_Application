import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  backendStatus: any = null;
  sampleData: any[] = [];
  loading = false;
  error: string | null = null;

  features = [
    {
      icon: '💧',
      title: 'Premium Wash Services',
      description: 'Professional exterior and interior cleaning for all vehicle types with eco-friendly products.'
    },
    {
      icon: '📅',
      title: 'Easy Booking',
      description: 'Schedule appointments online anytime, anywhere. Quick and hassle-free booking process.'
    },
    {
      icon: '⏱️',
      title: 'Real-Time Tracking',
      description: 'Track your vehicle service progress in real-time with live updates and notifications.'
    },
    {
      icon: '🔧',
      title: 'Vehicle Modifications',
      description: 'Request custom modifications and upgrades for your vehicle with expert consultation.'
    },
    {
      icon: '💳',
      title: 'Flexible Payment',
      description: 'Multiple payment options with secure transactions and digital invoicing.'
    },
    {
      icon: '🏆',
      title: 'Quality Guaranteed',
      description: 'Professional service with quality guarantee and customer satisfaction promise.'
    }
  ];

  statistics = [
    { value: '15K+', label: 'Happy Customers' },
    { value: '50K+', label: 'Cars Washed' },
    { value: '4.9/5', label: 'Rating' },
    { value: '24/7', label: 'Service Available' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkBackendHealth();
    this.loadSampleData();
  }

  checkBackendHealth() {
    this.http.get(`${environment.apiUrl}/api/health`)
      .subscribe({
        next: (response) => {
          this.backendStatus = response;
        },
        error: (err) => {
          this.error = 'Backend service is initializing...';
          console.error('Backend health check failed:', err);
        }
      });
  }

  loadSampleData() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/api/sample`)
      .subscribe({
        next: (data) => {
          this.sampleData = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error('Failed to load data:', err);
        }
      });
  }

  refreshData() {
    this.error = null;
    this.checkBackendHealth();
    this.loadSampleData();
  }
}

