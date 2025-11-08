import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  status: string;

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
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css'],
})
export class WorkerDashboardComponent implements OnInit {
  apiBaseUrl = 'https://localhost:7193/api/Appointments';

  activeTab: string = 'new';
  availableServices = [
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

        // Parse services for each appointment

        appointments.forEach((a) => {
          try {
            let parsed: any[] = [];

            if (a.selectedServicesJson) {
              // First, parse the string
              parsed = JSON.parse(a.selectedServicesJson);

              // Handle double-serialized strings
              if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
              }

              // Convert to service names
              a.services = parsed.map((s: any) => {
                if (typeof s === 'string') return s; // string service
                if (s && s.name) return s.name; // object with name
                return 'Unknown';
              });
            } else {
              a.services = [];
            }
          } catch (err) {
            console.error(
              'Failed to parse services',
              err,
              a.selectedServicesJson
            );
            a.services = [];
          }
        });

        // Filter by status
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
      },
      error: (err) => console.error('Failed to load appointments', err),
    });
  }

  moveToOnWork(appointment: Appointment): void {
    if (!appointment.returnDate || !appointment.returnTime) {
      alert('Please fill return date and time');
      return;
    }

    // Update status before sending to API
    appointment.status = 'Pending';

    // Calculate total payment if needed

    // Call API to update the appointment
    const payload = {
      id: appointment.id,
      customerName: appointment.customerName,
      phoneNumber: appointment.phoneNumber,
      status: appointment.status,

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
    // Prepare an updated copy with both key styles
    const updated = {
      ...appointment,
      status: 'OnWork',
      Status: 'OnWork', // for backend safety
    };

    // Send PUT request
    this.http.put(`${this.apiBaseUrl}/${appointment.id}`, updated).subscribe({
      next: (res) => {
        console.log('✅ PUT success:', res);

        // Move in UI
        this.pendingAppointments = this.pendingAppointments.filter(
          (a) => a.id !== appointment.id
        );
        this.onWorkAppointments.push({ ...appointment, status: 'OnWork' });

        // 🔄 Reload from backend to reflect DB updates
        setTimeout(() => this.loadAppointments(), 500);

        alert('Appointment confirmed and moved to OnWork!');
      },
      error: (err) => {
        console.error('❌ Failed to confirm appointment', err);
        alert('Failed to update appointment. Check console for details.');
      },
    });
  }

  cancelAppointment(appointment: Appointment): void {
    const updated = { ...appointment, status: 'Cancelled' };
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
    // Ensure extraPayment and extraCharges are numbers
    const extraPayment = appointment.extraPayment || 0;
    const extraCharges = this.extraCharges[appointment.id] || 0;
    const basePrice = appointment.basePrice || 3000; // default if basePrice not set

    // Calculate totalPayment
    // After updating services or extra payment
    appointment.totalPayment =
      (appointment.totalPriceLkr || 0) + (appointment.extraPayment || 0);

    // Update status
    appointment.status = 'Completed';

    // Update database
    this.http
      .put(`${this.apiBaseUrl}/${appointment.id}`, appointment)
      .subscribe({
        next: () => {
          // Remove from On Work tab
          this.onWorkAppointments = this.onWorkAppointments.filter(
            (a) => a.id !== appointment.id
          );

          // Add to Completed tab
          this.completedAppointments = [
            ...this.completedAppointments,
            appointment,
          ];

          // Switch to Completed tab
          this.activeTab = 'complete';

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
    return [...selectedServices, ...(appointment.additionalServices || [])];
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

  addService(appointment: Appointment): void {
    const selectedName = this.newServiceToAdd[appointment.id];
    if (!selectedName) return;

    const serviceObj = this.availableServices.find(
      (s) => s.name === selectedName
    );
    if (!serviceObj) return;

    if (!appointment.additionalServices) appointment.additionalServices = [];

    appointment.additionalServices.push(serviceObj.name);

    // Update SelectedServicesJson for backend
    const currentServices = JSON.parse(
      appointment.selectedServicesJson || '[]'
    );
    currentServices.push({
      name: serviceObj.name,
      basePrice: serviceObj.basePrice,
    });
    appointment.selectedServicesJson = JSON.stringify(currentServices);

    // Update TotalPriceLkr dynamically
    const totalBasePrice = currentServices.reduce(
      (sum: number, s: any) => sum + (s.basePrice || 0),
      0
    );
    appointment.totalPriceLkr = totalBasePrice;

    // Update total payment (TotalPrice + ExtraPayment)
    appointment.totalPayment = appointment.totalPayment =
      (appointment.totalPriceLkr || 0) + (appointment.extraPayment || 0);

    // Clear selected
    this.newServiceToAdd[appointment.id] = '';
  }

  updateExtraPayment(appointment: Appointment) {
    if (appointment.extraPayment == null) appointment.extraPayment = 0;

    // Save the updated extraPayment to DB
    this.http
      .put(`${this.apiBaseUrl}/${appointment.id}`, appointment)
      .subscribe({
        next: () => {
          console.log('Extra payment updated:', appointment.extraPayment);
        },
        error: (err) => console.error('Failed to update extra payment', err),
      });
  }

  getTotalPayment(appointment: Appointment): number {
    const basePrice = 3000; // example: replace with actual base price
    const extraPayment = appointment.extraPayment || 0; // from NEW tab
    const extraCharges = this.extraCharges[appointment.id] || 0; // from ON WORK tab
    return basePrice + extraPayment + extraCharges;
  }
}
