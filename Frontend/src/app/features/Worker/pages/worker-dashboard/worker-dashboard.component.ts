import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

interface Service {
  name: string;
  basePrice: number;
}

interface ApiAppointment {
  id: number;
  customerName: string;
  phoneNumber: string;
  status: string;
  vehicleName?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleType?: string;
  vehicleRegNumber?: string;
  selectedServicesJson?: string;
  totalPriceLkr?: number;
  appointmentDate: string;
  timeSlot: string;
  returnDate?: string;
  returnTime?: string;
  note?: string;
  extraPayment?: number;
  isPaid?: boolean;
}

interface Appointment {
  id: number;
  customerName: string;
  phoneNumber: string;
  Status: string;

  vehicleType: string;
  vehicleName?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleRegNumber?: string;
  selectedServicesJson?: string;
  totalPriceLkr?: number;
  appointmentDate: string;
  timeSlot: string;
  returnDate?: string | null;
  returnTime?: string | null;
  note?: string;
  extraPayment?: number;
  extraCharges?: number;
  totalPayment?: number;
  basePrice?: number;
  isPaid?: boolean;
  completedServices?: string[];
  additionalServices?: string[];
  services?: string[];
}

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SidebarComponent],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css'],
})
export class WorkerDashboardComponent implements OnInit {
  apiBaseUrl = 'https://localhost:7193/api/Appointments';

  activeTab: string = 'new';
  availableServices: Service[] = [
    { name: 'Washing', basePrice: 1000 },
    { name: 'Painting', basePrice: 8000 },
    { name: 'Battery Changing', basePrice: 2500 },
    { name: 'Oil Change', basePrice: 2000 },
    { name: 'Tire Replacement', basePrice: 3500 },
    { name: 'Engine Repair', basePrice: 12000 },
    { name: 'Brake Service', basePrice: 4000 },
  ];

  newAppointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];
  onWorkAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];

  newServiceToAdd: { [key: number]: string } = {};
  extraCharges: { [key: number]: number } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadAppointments(): void {
    this.http.get<any>(this.apiBaseUrl).subscribe({
      next: (res) => {
        const appointments: any[] = res.$values || [];

        appointments.forEach((a) => {
          try {
            let parsed: any[] = [];

            // ✅ Step 1: Parse JSON safely
            if (a.selectedServicesJson) {
              let jsonStr = a.selectedServicesJson.trim();

              // 🧹 Fix invalid JSON fragments (e.g., K"Service": or missing braces)
              jsonStr = jsonStr
                .replace(/^K/, '') // remove stray 'K'
                .replace(/([A-Za-z0-9]+)\s*:/g, '"$1":') // ensure proper keys
                .replace(/}\s*{/g, '},{') // fix missing commas
                .replace(/(\.\")/g, ',"'); // fix dots between key-values

              // Parse once
              parsed = JSON.parse(jsonStr);

              // Handle if result is a string (double stringified)
              if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
              }
            }

            // ✅ Step 2: Normalize services to names
            a.services = parsed.map((s: any) => {
              if (typeof s === 'string') return s;
              if (s?.name) return s.name;
              if (s?.Service) return s.Service; // legacy format
              return 'Unknown';
            });

            // ✅ Step 3: Normalize pricing info
            a.totalPriceLkr = a.totalPriceLkr || 0;
            a.extraPayment = a.extraPayment || 0;
            a.totalPayment = (a.totalPriceLkr || 0) + (a.extraPayment || 0);
          } catch (err) {
            console.error(
              '❌ Failed to parse services JSON:',
              a.selectedServicesJson,
              err
            );
            a.services = [];
          }
        });

        // ✅ Step 4: Split into tabs
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

        console.log('✅ Appointments loaded successfully');
      },
      error: (err) => {
        console.error('❌ Failed to load appointments', err);
      },
    });
  }

  getAllServiceObjects(appointment: Appointment): any[] {
    try {
      const parsed = appointment.selectedServicesJson
        ? JSON.parse(appointment.selectedServicesJson)
        : [];

      // Normalize into { name, basePrice }
      return parsed.map((s: any) => ({
        name: s?.name || s?.Service || 'Unknown',
        basePrice: s?.basePrice || s?.Price || 0,
      }));
    } catch {
      return [];
    }
  }

  moveToOnWork(appointment: Appointment): void {
    if (!appointment.returnDate || !appointment.returnTime) {
      alert('Please fill return date and time');
      return;
    }

    // Update status before sending to API
    appointment.Status = 'Pending';

    // Calculate total payment if needed

    // Call API to update the appointment
    const payload = {
      id: appointment.id,
      customerName: appointment.customerName,
      phoneNumber: appointment.phoneNumber,
      status: appointment.Status,

      vehicleName: appointment.vehicleName,
      vehicleModel: appointment.vehicleModel,
      vehicleYear: appointment.vehicleYear,
      vehicleType: appointment.vehicleType,
      vehicleRegNumber: appointment.vehicleRegNumber,
      selectedServicesJson: appointment.selectedServicesJson,
      totalPriceLkr: appointment.totalPriceLkr,
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      returnDate: appointment.returnDate,
      returnTime: appointment.returnTime,
      note: appointment.note,
      extraPayment: appointment.extraPayment,
      isPaid: appointment.isPaid,
      totalPayment:
        (appointment.totalPriceLkr || 0) + (appointment.extraPayment || 0),
    };

    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, payload).subscribe({
      next: (res) => {
        // success code same as before
        const index = this.newAppointments.indexOf(appointment);
        if (index > -1) this.newAppointments.splice(index, 1);
        this.pendingAppointments.push(appointment);
        alert('Appointment updated and moved to Pending!');
      },
      error: (err) => {
        console.error('Failed to update appointment', err);
        alert('Failed to update appointment. Please try again.');
      },
    });
  }

  moveToPending(appointment: Appointment): void {
    if (!appointment.returnDate || !appointment.returnTime) {
      alert('Please fill return date and time');
      return;
    }

    const updated = { ...appointment, status: 'Pending' };

    // Parse services for the updated object
    try {
      const parsed = updated.selectedServicesJson
        ? JSON.parse(updated.selectedServicesJson)
        : [];
      updated.services = parsed.map((s: any) =>
        typeof s === 'string' ? s : s.name || 'Unknown'
      );
    } catch {
      updated.services = [];
    }

    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, updated).subscribe({
      next: () => {
        // Remove from newAppointments
        this.newAppointments = this.newAppointments.filter(
          (a) => a.id !== appointment.id
        );

        // Push into pendingAppointments **as a new array**
        this.pendingAppointments = [...this.pendingAppointments, updated];
      },
      error: (err) => console.error('Failed to update appointment', err),
    });
  }

  confirmAppointment(appointment: Appointment): void {
    if (!appointment.returnDate || !appointment.returnTime) {
      alert('Please fill return date and time');
      return;
    }

    const payload = {
      Id: appointment.id, // PascalCase
      CustomerName: appointment.customerName || '', // required string
      PhoneNumber: appointment.phoneNumber || '', // required string
      Status: 'OnWork',
      TotalPriceLkr: appointment.totalPriceLkr || 0,
      ExtraPayment: appointment.extraPayment || 0,
      ReturnDate: appointment.returnDate || null,
      ReturnTime: appointment.returnTime || null,
      SelectedServicesJson: appointment.selectedServicesJson || '[]',
      Note: appointment.note || '',
      IsPaid: appointment.isPaid ?? false, // boolean
    };

    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, payload).subscribe({
      next: () => {
        this.pendingAppointments = this.pendingAppointments.filter(
          (a) => a.id !== appointment.id
        );
        this.onWorkAppointments.push({ ...appointment, Status: 'OnWork' });
        alert('Appointment confirmed and moved to OnWork!');
      },
      error: (err) => {
        console.error('Failed to confirm appointment', err);
        if (err.error?.errors) {
          console.error('Validation errors:', err.error.errors);
        }
        alert(
          'Failed to confirm appointment. Check console for validation errors.'
        );
      },
    });
  }

  cancelAppointment(appointment: Appointment): void {
    const updated = { ...appointment, Status: 'Cancelled' };
    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, updated).subscribe({
      next: () => {
        this.pendingAppointments = this.pendingAppointments.filter(
          (a) => a.id !== appointment.id
        );
      },
      error: (err) => console.error('Failed to cancel appointment', err),
    });
  }

  finishWork(appointment: Appointment): void {
    if (!appointment) return;

    // Ensure numeric values
    const extraPayment = appointment.extraPayment || 0;
    const totalPriceLkr = appointment.totalPriceLkr || 0;

    // Prepare payload for API (match backend property names)
    const payload = {
      id: appointment.id,
      customerName: appointment.customerName,
      phoneNumber: appointment.phoneNumber,
      status: 'Completed', // lowercase 'status' is important
      totalPriceLkr: totalPriceLkr,
      extraPayment: extraPayment,
      totalPayment: totalPriceLkr + extraPayment,
      returnDate: appointment.returnDate || null,
      returnTime: appointment.returnTime || null,
      selectedServicesJson: appointment.selectedServicesJson || '[]',
      note: appointment.note || '',
      isPaid: appointment.isPaid ?? false,
    };

    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, payload).subscribe({
      next: () => {
        // Remove from OnWork
        this.onWorkAppointments = this.onWorkAppointments.filter(
          (a) => a.id !== appointment.id
        );

        // Push new object into Completed
        this.completedAppointments = [
          ...this.completedAppointments,
          { ...appointment, Status: 'Completed' },
        ];

        // Switch tab
        this.activeTab = 'completed';

        alert('Appointment marked as Completed!');
      },
      error: (err) => {
        console.error('Failed to finish appointment', err);
        alert('Failed to mark appointment as Completed.');
      },
    });
  }

  toggleServiceCompletion(appointment: Appointment, service: string): void {
    if (!appointment.completedServices) {
      appointment.completedServices = [];
    }

    const index = appointment.completedServices.indexOf(service);
    if (index > -1) {
      appointment.completedServices.splice(index, 1); // uncheck
    } else {
      appointment.completedServices.push(service); // check
    }

    // Optionally, update the database if you want to persist
    const payload = { ...appointment };
    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, payload).subscribe({
      next: () =>
        console.log(`Service status updated for ${appointment.customerName}`),
      error: (err) => console.error('Failed to update service status', err),
    });
  }

  // Utility methods
  getAllServices(appointment: Appointment): string[] {
    let parsed: any[] = [];
    try {
      parsed = appointment.selectedServicesJson
        ? JSON.parse(appointment.selectedServicesJson)
        : [];
    } catch {
      parsed = [];
    }

    // Convert parsed array to strings
    const selectedServices = parsed.map((s: any) =>
      typeof s === 'string' ? s : s.name || 'Unknown'
    );

    // Combine with additionalServices (strings)
    return Array.from(
      new Set([...selectedServices, ...(appointment.additionalServices || [])])
    );
  }

  togglePaidStatus(appointment: Appointment) {
    // Toggle boolean in frontend
    appointment.isPaid = !appointment.isPaid;

    // Convert to 0 or 1 for database
    const payload = {
      ...appointment,
      isPaid: appointment.isPaid ? 1 : 0, // store as 1 (paid) or 0 (unpaid)
    };

    // Update in DB
    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, payload).subscribe({
      next: () =>
        console.log(`Paid status updated for appointment ${appointment.id}`),
      error: (err) => console.error('Failed to update paid status', err),
    });
  }

  isServiceCompleted(appointment: Appointment, service: string): boolean {
    return appointment.completedServices?.includes(service) || false;
  }

  addService(appointment: any): void {
    const serviceName = this.newServiceToAdd[appointment.id];
    if (!serviceName) return;

    const serviceToAdd = this.availableServices.find(
      (s) => s.name === serviceName
    );
    if (!serviceToAdd) return;

    // Parse current services
    let services = [];
    try {
      services = JSON.parse(appointment.selectedServicesJson || '[]');
    } catch {
      services = [];
    }

    // Add new service object
    services.push({
      name: serviceToAdd.name,
      basePrice: serviceToAdd.basePrice,
    });

    appointment.selectedServicesJson = JSON.stringify(services);

    // Update totals
    appointment.totalPriceLkr =
      (appointment.totalPriceLkr || 0) + serviceToAdd.basePrice;

    // Reset dropdown
    this.newServiceToAdd[appointment.id] = '';

    // Save to backend
    this.updateAppointment(appointment);
  }

  updateAppointment(appointment: any): void {
    const url = `${this.apiBaseUrl}/${appointment.id}`;
    this.http.put(url, appointment).subscribe({
      next: () => console.log('Appointment updated'),
      error: (err) => console.error('Update failed', err),
    });
  }

  updateExtraPayment(appointment: any): void {
    appointment.totalPayment =
      (appointment.totalPriceLkr || 0) + (appointment.extraPayment || 0);
    this.updateAppointment(appointment);
  }

  getTotalPayment(appointment: Appointment): number {
    const basePrice = 3000; // example: replace with actual base price
    const extraPayment = appointment.extraPayment || 0; // from NEW tab
    const extraCharges = this.extraCharges[appointment.id] || 0; // from ON WORK tab
    return basePrice + extraPayment + extraCharges;
  }
}
