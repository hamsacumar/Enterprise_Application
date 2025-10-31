import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ServiceItem } from '../services/admin.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  private adminService = inject(AdminService);

  services: ServiceItem[] = [];
  loading = true;
  error: string | null = null;

  // Add form
  showAddForm = false;
  newService: Partial<ServiceItem> = { name: '', description: '', price: 0 };

  // Edit form
  editingServiceId: string | null = null;
  editingService: Partial<ServiceItem> = {};

  ngOnInit(): void {
    this.fetchServices();
  }

  /** Fetch all services */
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

  /** Toggle add form */
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newService = { name: '', description: '', price: 0 };
  }

  /** Add new service */
  addService(): void {
    if (!this.newService.name || this.newService.price == null) return;

    const payload: Omit<ServiceItem, 'id' | 'createdAt'> = {
      name: this.newService.name,
      description: this.newService.description || '',
      price: this.newService.price
    };

    this.adminService.addService(payload).subscribe({
      next: (service) => {
        this.services.unshift(service);
        this.showAddForm = false;
        this.newService = { name: '', description: '', price: 0 };
      },
      error: (err) => console.error('Error adding service:', err)
    });
  }

  /** Cancel add form */
  cancelAdd(): void {
    this.showAddForm = false;
    this.newService = { name: '', description: '', price: 0 };
  }

  /** Start editing a service */
  editService(service: ServiceItem): void {
    const id = (service as any).id ?? (service as any).Id;
    if (!id) return;
    
    this.editingServiceId = id;
    this.editingService = { 
      name: service.name, 
      description: service.description, 
      price: service.price 
    };
  }

  /** Save updated service */
  saveService(): void {
    if (!this.editingServiceId || !this.editingService.name || this.editingService.price == null) return;

    const payload: Omit<ServiceItem, 'id' | 'createdAt'> = {
      name: this.editingService.name,
      description: this.editingService.description || '',
      price: this.editingService.price
    };

    this.adminService.updateService(this.editingServiceId, payload).subscribe({
      next: () => {
        this.fetchServices();
        this.editingServiceId = null;
        this.editingService = {};
      },
      error: (err) => {
        console.error('Error updating service:', err);
        this.error = 'Failed to update service';
      }
    });
  }

  /** Cancel editing */
  cancelEdit(): void {
    this.editingServiceId = null;
    this.editingService = {};
  }

  /** Delete service */
  deleteService(service: ServiceItem): void {
    const id = (service as any).id ?? (service as any).Id;
    if (!id) return;
    if (!confirm(`Delete "${service.name}"?`)) return;

    this.adminService.deleteService(id).subscribe({
      next: () => {
        this.fetchServices();
      },
      error: (err) => {
        console.error('Error deleting service:', err);
        this.error = 'Failed to delete service';
      }
    });
  }

  /** Get service ID for comparison */
  getServiceId(service: ServiceItem): string {
    return (service as any).id ?? (service as any).Id ?? '';
  }
}