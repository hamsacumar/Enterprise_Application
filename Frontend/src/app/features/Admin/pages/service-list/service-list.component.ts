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
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  private adminService = inject(AdminService);

  services: ServiceWithMenu[] = [];
  groupedServices: Record<string, ServiceWithMenu[]> = {};
  loading = true;
  error: string | null = null;

  // Add form
  showAddForm = false;
  newService: Partial<ServiceItem> = {
    name: '',
    description: '',
    price: 0,
    vehicleCategory: '',
  };

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
        this.services = data.map((item) => ({ ...item, showMenu: false }));
        this.groupServicesByCategory();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.error = 'Failed to load services';
        this.loading = false;
      },
    });
  }

  /** Group services by vehicle category */
  private groupServicesByCategory(): void {
    this.groupedServices = this.services.reduce((acc, service) => {
      const category = service.vehicleCategory || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    }, {} as Record<string, ServiceWithMenu[]>);
  }

  /** Toggle add form */
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newService = {
      name: '',
      description: '',
      price: 0,
      vehicleCategory: '',
    };
  }

  /** Add new service */
  addService(): void {
    if (
      !this.newService.name ||
      this.newService.price == null ||
      !this.newService.vehicleCategory
    )
      return;

    const payload: Omit<ServiceItem, 'id' | 'createdAt'> = {
      name: this.newService.name,
      description: this.newService.description || '',
      price: this.newService.price,
      vehicleCategory: this.newService.vehicleCategory,
    };

    this.adminService.addService(payload).subscribe({
      next: (service) => {
        this.services.unshift({ ...service, showMenu: false });
        this.groupServicesByCategory();
        this.showAddForm = false;
        this.newService = {
          name: '',
          description: '',
          price: 0,
          vehicleCategory: '',
        };
      },
      error: (err) => console.error('Error adding service:', err),
    });
  }

  /** Cancel add form */
  cancelAdd(): void {
    this.showAddForm = false;
    this.newService = {
      name: '',
      description: '',
      price: 0,
      vehicleCategory: '',
    };
  }

  /** Start editing a service */
  editService(service: ServiceWithMenu): void {
    const id = this.getServiceId(service);
    if (!id) return;

    this.editingServiceId = id;
    this.editingService = {
      name: service.name,
      description: service.description,
      price: service.price,
      vehicleCategory: service.vehicleCategory,
    };
  }

  /** Save updated service */
  saveService(): void {
    if (
      !this.editingServiceId ||
      !this.editingService.name ||
      this.editingService.price == null
    )
      return;

    const payload: Omit<ServiceItem, 'id' | 'createdAt'> = {
      name: this.editingService.name,
      description: this.editingService.description || '',
      price: this.editingService.price,
      vehicleCategory: this.editingService.vehicleCategory || 'General',
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
      },
    });
  }

  cancelEdit(): void {
    this.editingServiceId = null;
    this.editingService = {};
  }

  deleteService(service: ServiceWithMenu): void {
    const id = this.getServiceId(service);
    if (!id) return;
    if (!confirm(`Delete "${service.name}"?`)) return;

    this.adminService.deleteService(id).subscribe({
      next: () => this.fetchServices(),
      error: (err) => {
        console.error('Error deleting service:', err);
        this.error = 'Failed to delete service';
      },
    });
  }

  toggleMenu(service: ServiceWithMenu, event: MouseEvent): void {
    event.stopPropagation();
    const wasOpen = !!service.showMenu;
    this.closeAllMenus();
    service.showMenu = !wasOpen;
  }

  private closeAllMenus(): void {
    this.services.forEach((s) => (s.showMenu = false));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (!target.closest('.menu-container')) this.closeAllMenus();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeAllMenus();
  }

  getServiceId(service: ServiceWithMenu): string {
    return (service as any).id ?? (service as any).Id ?? '';
  }
}
