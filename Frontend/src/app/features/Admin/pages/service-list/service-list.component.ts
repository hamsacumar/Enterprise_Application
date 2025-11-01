import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ServiceItem } from '../../services/admin.service';

type ServiceWithMenu = ServiceItem & { showMenu?: boolean };

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  private adminService = inject(AdminService);

  services: ServiceWithMenu[] = [];
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
        // Add local property showMenu for dropdown toggle
        this.services = data.map(item => ({ ...item, showMenu: false }));
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
        // Add new service at the top with showMenu property
        this.services.unshift({ ...service, showMenu: false });
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
  editService(service: ServiceWithMenu): void {
    const id = this.getServiceId(service);
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
  deleteService(service: ServiceWithMenu): void {
    const id = this.getServiceId(service);
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

  /** Toggle menu visibility for a service */
  toggleMenu(service: ServiceWithMenu, event: MouseEvent): void {
    event.stopPropagation();
    const wasOpen = !!service.showMenu;
    this.closeAllMenus();
    service.showMenu = !wasOpen;
  }

  private closeAllMenus(): void {
    this.services.forEach(s => (s.showMenu = false));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    // If click is outside any menu-container, close all
    if (!target.closest('.menu-container')) {
      this.closeAllMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeAllMenus();
  }

  /** Get service ID safely */
  getServiceId(service: ServiceWithMenu): string {
    return (service as any).id ?? (service as any).Id ?? '';
  }
}
