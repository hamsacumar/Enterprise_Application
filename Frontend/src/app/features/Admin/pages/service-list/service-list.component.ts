import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  private adminService = inject(AdminService);
  services: any[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.loading = true;
    this.adminService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.error = 'Failed to load services';
        this.loading = false;
      }
    });
  }
}
