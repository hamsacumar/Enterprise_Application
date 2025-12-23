import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // User info
  userName: string = 'John Doe';
  userGreeting: string = '';

  // Vehicles
  vehicles: Vehicle[] = [];
  isLoadingVehicles: boolean = false;

  // Recent appointments
  recentAppointments: Appointment[] = [];
  isLoadingAppointments: boolean = false;

  // Stats cards
  stats = [
    {
      title: 'Total Appointments',
      value: 12,
      icon: 'calendar',
      color: '#3b82f6',
      change: '+2 this month'
    },
    {
      title: 'Active Vehicles',
      value: 0,
      icon: 'vehicle',
      color: '#2563eb',
      change: 'registered'
    },
    {
      title: 'Pending Requests',
      value: 2,
      icon: 'clock',
      color: '#1d4ed8',
      change: 'Awaiting approval'
    },
    {
      title: 'Completed Services',
      value: 8,
      icon: 'check',
      color: '#1e40af',
      change: 'Last 30 days'
    }
  ];


  // Quick actions
  quickActions = [
    {
      title: 'Book Service',
      icon: 'add',
      route: '/user/book-service',
      color: '#3b82f6'
    },
    {
      title: 'My Vehicles',
      icon: 'vehicle',
      route: '/user/my-vehicles',
      color: '#2563eb'
    },
    {
      title: 'Past Orders',
      icon: 'list',
      route: '/user/past-orders',
      color: '#1d4ed8'
    },
    {
      title: 'Notifications',
      icon: 'notification',
      route: '/user/notifications',
      color: '#1e40af'
    }
  ];

  // Upcoming services
  upcomingServices = [
    {
      service: 'Regular Maintenance',
      vehicle: 'Toyota Camry',
      date: 'Dec 1, 2024',
      daysLeft: 21
    },
    {
      service: 'Oil Change',
      vehicle: 'Honda Civic',
      date: 'Dec 15, 2024',
      daysLeft: 35
    }
  ];

  constructor(
    private vehicleService: VehicleService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.setGreeting();
    this.loadVehicles();
    this.loadRecentAppointments();
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.userGreeting = 'Good Morning';
    } else if (hour < 18) {
      this.userGreeting = 'Good Afternoon';
    } else {
      this.userGreeting = 'Good Evening';
    }
  }

  loadVehicles(): void {
    this.isLoadingVehicles = true;
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        // Update Active Vehicles stat
        this.stats[1].value = vehicles.length;
        this.stats[1].change = vehicles.length === 1 ? 'vehicle registered' : 'vehicles registered';
        this.isLoadingVehicles = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.isLoadingVehicles = false;
      }
    });
  }

  loadRecentAppointments(): void {
    this.isLoadingAppointments = true;
    // Fetch appointments with status: OnWork, Pending, or New
    this.appointmentService.getAppointments('OnWork,Pending,New').subscribe({
      next: (appointments) => {
        this.recentAppointments = appointments.slice(0, 5); // Show only latest 5
        // Update stats
        this.stats[0].value = appointments.length;
        this.stats[2].value = appointments.filter(a => a.status === 'Pending' || a.status === 'New').length;
        this.isLoadingAppointments = false;
        
        // Load completed appointments for stats
        this.loadCompletedCount();
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoadingAppointments = false;
      }
    });
  }

  loadCompletedCount(): void {
    this.appointmentService.getAppointments('Completed').subscribe({
      next: (appointments) => {
        this.stats[3].value = appointments.length;
      },
      error: (error) => {
        console.error('Error loading completed appointments:', error);
      }
    });
  }

  getServiceNames(appointment: Appointment): string {
    try {
      const services = JSON.parse(appointment.selectedServicesJson);
      if (Array.isArray(services) && services.length > 0) {
        return services.map((s: any) => s.name).join(', ');
      }
    } catch (e) {
      console.error('Error parsing services:', e);
    }
    return 'Service';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'New': 'badge-blue',
      'Pending': 'badge-blue-light',
      'OnWork': 'badge-blue-medium',
      'Completed': 'badge-blue-dark',
      'Cancelled': 'badge-blue-gray'
    };
    return statusMap[status] || 'badge-blue-gray';
  }
}
