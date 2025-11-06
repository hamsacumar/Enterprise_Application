// worker-dashboard.component.ts
/*import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Appointment {
  id: string;
  customerName: string;
  phoneNumber: string;
  vehicleName: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleRegNumber: string;
  services: string[];
  appointmentDate: string;
  timeSlot: string;
  returnDate?: string;
  returnTime?: string;
  note?: string;
  extraPayment?: number;
  totalPayment?: number;
  isPaid?: boolean;
  completedServices?: string[];
  additionalServices?: string[];
}

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css'],
})
export class WorkerDashboardComponent {
  activeTab: string = 'new';

  availableServices: string[] = [
    'Washing',
    'Painting',
    'Battery Changing',
    'Oil Change',
    'Tire Replacement',
    'Engine Repair',
    'Brake Service',
    'Wheel Alignment',
    'Air Filter Replacement',
    'Coolant Refill',
    'AC Gas Refill',
    'Suspension Check',
    'Full Inspection',
  ];

  newAppointments: Appointment[] = [
    {
      id: '1',
      customerName: 'John Doe',
      phoneNumber: '0712345678',
      vehicleName: 'Toyota Camry',
      vehicleModel: '2020',
      vehicleYear: 2020,
      vehicleType: 'Car',
      vehicleRegNumber: 'ABC-1234',
      services: ['Washing', 'Oil Change'],
      appointmentDate: '2025-11-10',
      timeSlot: '8-10 AM',
    },
    {
      id: '2',
      customerName: 'Sarah Smith',
      phoneNumber: '0776543210',
      vehicleName: 'Honda CBR',
      vehicleModel: '2021',
      vehicleYear: 2021,
      vehicleType: 'Bike',
      vehicleRegNumber: 'XYZ-5678',
      services: ['Battery Changing'],
      appointmentDate: '2025-11-10',
      timeSlot: '10-12 PM',
    },
    {
      id: '3',
      customerName: 'Sarah Smith',
      phoneNumber: '0776543210',
      vehicleName: 'Honda CBR',
      vehicleModel: '2021',
      vehicleYear: 2021,
      vehicleType: 'Bike',
      vehicleRegNumber: 'XYZ-5678',
      services: ['Battery Changing'],
      appointmentDate: '2025-11-10',
      timeSlot: '10-12 PM',
    },
    {
      id: '4',
      customerName: 'Sarah Smith',
      phoneNumber: '0776543210',
      vehicleName: 'Honda CBR',
      vehicleModel: '2021',
      vehicleYear: 2021,
      vehicleType: 'Bike',
      vehicleRegNumber: 'XYZ-5678',
      services: ['Battery Changing'],
      appointmentDate: '2025-11-10',
      timeSlot: '10-12 PM',
    },
    {
      id: '5',
      customerName: 'Sarah Smith',
      phoneNumber: '0776543210',
      vehicleName: 'Honda CBR',
      vehicleModel: '2021',
      vehicleYear: 2021,
      vehicleType: 'Bike',
      vehicleRegNumber: 'XYZ-5678',
      services: ['Battery Changing'],
      appointmentDate: '2025-11-10',
      timeSlot: '10-12 PM',
    },
  ];

  pendingAppointments: Appointment[] = [];
  onWorkAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];

  newServiceToAdd: { [key: string]: string } = {};
  extraCharges: { [key: string]: number } = {};

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  moveToOnWork(appointment: Appointment): void {
    if (!appointment.returnDate || !appointment.returnTime) {
      alert('Please fill return date and time');
      return;
    }

    const index = this.newAppointments.indexOf(appointment);
    if (index > -1) {
      this.newAppointments.splice(index, 1);
      appointment.completedServices = [];
      appointment.additionalServices = [];
      appointment.totalPayment = this.calculatePayment(appointment);
      appointment.isPaid = false;
      this.pendingAppointments.push(appointment);
    }
  }

  confirmAppointment(appointment: Appointment): void {
    const index = this.pendingAppointments.indexOf(appointment);
    if (index > -1) {
      this.pendingAppointments.splice(index, 1);
      this.onWorkAppointments.push(appointment);
    }
  }

  cancelAppointment(appointment: Appointment): void {
    const index = this.pendingAppointments.indexOf(appointment);
    if (index > -1) {
      this.pendingAppointments.splice(index, 1);
    }
  }

  toggleServiceCompletion(appointment: Appointment, service: string): void {
    if (!appointment.completedServices) {
      appointment.completedServices = [];
    }

    const index = appointment.completedServices.indexOf(service);
    if (index > -1) {
      appointment.completedServices.splice(index, 1);
    } else {
      appointment.completedServices.push(service);
    }
  }

  isServiceCompleted(appointment: Appointment, service: string): boolean {
    return appointment.completedServices?.includes(service) || false;
  }

  addService(appointment: Appointment): void {
    const service = this.newServiceToAdd[appointment.id];
    if (service && service.trim()) {
      if (!appointment.additionalServices) {
        appointment.additionalServices = [];
      }
      appointment.additionalServices.push(service);
      appointment.totalPayment = this.calculatePayment(appointment);
      this.newServiceToAdd[appointment.id] = '';
    }
  }

  calculatePayment(appointment: Appointment): number {
    const basePrice = 50;
    const totalServices =
      appointment.services.length +
      (appointment.additionalServices?.length || 0);
    return basePrice * totalServices + (appointment.extraPayment || 0);
  }

  updateExtraCharges(appointment: Appointment): void {
    const extra = this.extraCharges[appointment.id] || 0;
    appointment.extraPayment = extra;
    appointment.totalPayment = this.calculatePayment(appointment);
  }

  togglePaidStatus(appointment: Appointment): void {
    appointment.isPaid = !appointment.isPaid;
  }

  finishWork(appointment: Appointment): void {
    const allServices = [
      ...appointment.services,
      ...(appointment.additionalServices || []),
    ];
    const allCompleted = allServices.every((s) =>
      appointment.completedServices?.includes(s)
    );

    if (!allCompleted) {
      alert('Please complete all services before finishing');
      return;
    }

    const index = this.onWorkAppointments.indexOf(appointment);
    if (index > -1) {
      this.onWorkAppointments.splice(index, 1);
      this.completedAppointments.push(appointment);
    }
  }

  getAllServices(appointment: Appointment): string[] {
    return [...appointment.services, ...(appointment.additionalServices || [])];
  }
}
*/

// worker-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface AppointmentService {
  appointmentId: number;
  serviceId: number;
  service: {
    id: number;
    serviceName: string;
    basePrice: number;
  };
}

interface Appointment {
  id: number;
  customerName: string;
  phoneNumber: string;
  vehicleName: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleRegNumber: string;

  appointmentDate: string;
  timeSlot: string;
  returnDate?: string;
  returnTime?: string;
  note?: string;
  extraPayment?: number;
  totalPayment?: number;
  isPaid?: boolean;
  status?: 'New' | 'Pending' | 'OnWork' | 'Completed';
  totalPriceLkr?: number;

  vehicle?: {
    id: number;
    name: string;
    model: string;
    year: number;
    regNumber: string;
    type: string;
    color: string;
  };

  appointmentServices?: AppointmentService[]; // ✅ changed from string[] to object[]
  additionalServices?: Service[];
  completedServices?: string[];
}

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css'],
})
export class WorkerDashboardComponent implements OnInit {
  activeTab: string = 'new';

  availableServices: Service[] = [];

  newAppointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];
  onWorkAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];

  newServiceToAdd: { [appointmentId: string]: Service | null } = {};
  extraCharges: { [key: string]: number } = {};

  // Backend API URLs
  private apiUrl = 'https://localhost:7193/api/Appointments';
  private servicesApiUrl = 'https://localhost:7193/api/Services';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadAppointments();
  }

  /** Load list of available services from backend */
  loadServices(): void {
    this.http.get<Service[]>(this.servicesApiUrl).subscribe({
      next: (data) => {
        this.availableServices = data;
        console.log('Loaded services:', data);
      },
      error: (err) => {
        console.error('Failed to load services', err);
        alert('Could not load service list from backend.');
      },
    });
  }

  /** Load all appointments from backend */
  loadAppointments(): void {
    this.http.get<Appointment[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Format data to avoid undefined/null issues
        const appointments = data.map((a) => ({
          ...a,
          appointmentDate: a.appointmentDate || '',
          timeSlot: a.timeSlot || '',
          returnDate: a.returnDate || '',
          returnTime: a.returnTime || '',
          appointmentServices: a.appointmentServices || [],
          totalPayment: a.totalPriceLkr || 0,
        }));

        // Separate by status
        this.newAppointments = appointments.filter((a) => a.status === 'New');
        this.pendingAppointments = appointments.filter(
          (a) => a.status === 'Pending'
        );
        this.onWorkAppointments = appointments.filter(
          (a) => a.status === 'OnWork'
        );
        this.completedAppointments = appointments.filter(
          (a) => a.status === 'Completed'
        );

        // Calculate payment
        appointments.forEach(
          (a) => (a.totalPayment = this.calculatePayment(a))
        );
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
        alert('Failed to load appointments from backend.');
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /** Move appointment from New → Pending */
  moveToOnWork(appointment: Appointment): void {
    const hasDate =
      appointment.returnDate && appointment.returnDate.trim() !== '';
    const hasTime =
      appointment.returnTime && appointment.returnTime.trim() !== '';

    if (!hasDate || !hasTime) {
      alert('Please fill return date and time');
      return;
    }

    appointment.status = 'Pending';

    this.http.put(`${this.apiUrl}/${appointment.id}`, appointment).subscribe({
      next: () => {
        const index = this.newAppointments.indexOf(appointment);
        if (index > -1) {
          this.newAppointments.splice(index, 1);
          this.pendingAppointments.push(appointment);
        }
      },
      error: (err) => {
        console.error('Failed to move appointment to Pending', err);
        alert('Could not update appointment. Try again.');
      },
    });
  }

  /** Move appointment from Pending → OnWork */
  confirmAppointment(appointment: Appointment): void {
    const index = this.pendingAppointments.indexOf(appointment);
    if (index > -1) {
      this.pendingAppointments.splice(index, 1);
      appointment.status = 'OnWork';
      this.onWorkAppointments.push(appointment);

      this.http.put(`${this.apiUrl}/${appointment.id}`, appointment).subscribe({
        next: () => console.log('Appointment status updated to OnWork'),
        error: (err) => console.error('Error updating appointment:', err),
      });
    }
  }

  cancelAppointment(appointment: Appointment): void {
    const index = this.pendingAppointments.indexOf(appointment);
    if (index > -1) {
      this.pendingAppointments.splice(index, 1);
    }
  }

  /** Mark service as completed/uncompleted */
  toggleServiceCompletion(appointment: Appointment, serviceName: string): void {
    if (!appointment.completedServices) {
      appointment.completedServices = [];
    }

    const idx = appointment.completedServices.indexOf(serviceName);
    if (idx > -1) {
      appointment.completedServices.splice(idx, 1);
    } else {
      appointment.completedServices.push(serviceName);
    }
  }

  isServiceCompleted(appointment: Appointment, serviceName: string): boolean {
    return appointment.completedServices?.includes(serviceName) || false;
  }

  /** Add extra service dynamically */
  addService(appointment: Appointment): void {
    const selectedService = this.newServiceToAdd[appointment.id];
    if (selectedService) {
      if (!appointment.additionalServices) {
        appointment.additionalServices = [];
      }

      appointment.additionalServices.push(selectedService);
      appointment.totalPayment = this.calculatePayment(appointment);
      this.newServiceToAdd[appointment.id] = null;
    }
  }

  /** Calculate total payment */
  calculatePayment(appointment: Appointment): number {
    // Convert string services into Service-like objects with basePrice = 0
    const baseServices = (appointment.appointmentServices || []).map(
      (name) => ({
        id: 0,
        serviceName: name,
        basePrice: 0,
      })
    );

    const extraServices = appointment.additionalServices || [];

    const total = [...baseServices, ...extraServices].reduce(
      (sum, s) => sum + (s.basePrice || 0),
      0
    );

    return total + (appointment.extraPayment || 0);
  }

  /** Update extra payment input */
  updateExtraCharges(appointment: Appointment): void {
    const extra = this.extraCharges[appointment.id] || 0;
    appointment.extraPayment = extra;
    appointment.totalPayment = this.calculatePayment(appointment);
  }

  togglePaidStatus(appointment: Appointment): void {
    appointment.isPaid = !appointment.isPaid;
  }

  /** Finish work (OnWork → Completed) */
  finishWork(appointment: Appointment): void {
    const allServices = [
      ...(appointment.appointmentServices || []),
      ...(appointment.additionalServices || []),
    ].map((s) => (typeof s === 'string' ? { serviceName: s } : s));

    const allCompleted = allServices.every((s) =>
      appointment.completedServices?.includes(s.serviceName)
    );

    if (!allCompleted) {
      alert('Please complete all services before finishing');
      return;
    }

    const index = this.onWorkAppointments.indexOf(appointment);
    if (index > -1) {
      this.onWorkAppointments.splice(index, 1);
      this.completedAppointments.push(appointment);
    }
  }

  /** Combine both base and added services */
  getAllServices(appointment: Appointment): Service[] {
    const baseServices: Service[] = (appointment.appointmentServices || []).map(
      (as) => as.service // ✅ extract actual service
    );

    return [...baseServices, ...(appointment.additionalServices || [])];
  }
}
