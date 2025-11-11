import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService, Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-recent-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './recent-appointments.html',
  styleUrls: ['./recent-appointments.css']
})
export class RecentAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading: boolean = false;
  updatingStatus: { [key: number]: boolean } = {};
  showDetails: { [key: number]: boolean } = {};

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadRecentAppointments();
  }

  loadRecentAppointments(): void {
    this.isLoading = true;
    // Fetch appointments with status: OnWork, Pending, or New
    this.appointmentService.getAppointments('OnWork,Pending,New').subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent appointments:', error);
        alert('Failed to load recent appointments. Please try again.');
        this.isLoading = false;
      }
    });
  }

  getServiceNames(appointment: Appointment): string[] {
    try {
      const services = JSON.parse(appointment.selectedServicesJson);
      if (Array.isArray(services) && services.length > 0) {
        return services.map((s: any) => s.name);
      }
    } catch (e) {
      console.error('Error parsing services:', e);
    }
    return ['Service'];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatTime(timeString: string): string {
    return timeString || 'N/A';
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'New': 'badge-blue',
      'Pending': 'badge-blue-light',
      'OnWork': 'badge-blue-medium',
      'Completed': 'badge-blue-dark',
      'Rejected': 'badge-red',
      'Cancelled': 'badge-blue-gray'
    };
    return statusMap[status] || 'badge-blue-gray';
  }

  isPending(status: string): boolean {
    return status === 'Pending';
  }

  acceptAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to accept this appointment?')) {
      this.updateAppointmentStatus(appointment.id, 'OnWork');
    }
  }

  rejectAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to reject this appointment?')) {
      this.updateAppointmentStatus(appointment.id, 'Rejected');
    }
  }

  updateAppointmentStatus(appointmentId: number, newStatus: string): void {
    this.updatingStatus[appointmentId] = true;
    
    this.appointmentService.updateStatus(appointmentId, newStatus).subscribe({
      next: () => {
        // Update the appointment status in the local array
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (appointment) {
          appointment.status = newStatus;
        }
        this.updatingStatus[appointmentId] = false;
        
        // If status changed to Rejected, remove from list or reload
        if (newStatus === 'Rejected') {
          this.appointments = this.appointments.filter(a => a.id !== appointmentId);
        }
      },
      error: (error) => {
        console.error('Error updating appointment status:', error);
        alert('Failed to update appointment status. Please try again.');
        this.updatingStatus[appointmentId] = false;
      }
    });
  }

  viewDetails(appointment: Appointment): void {
    this.showDetails[appointment.id] = !this.showDetails[appointment.id];
  }

  getServiceDetails(appointment: Appointment): any[] {
    try {
      const services = JSON.parse(appointment.selectedServicesJson);
      if (Array.isArray(services) && services.length > 0) {
        return services;
      }
    } catch (e) {
      console.error('Error parsing services:', e);
    }
    return [];
  }

  getSubtotal(appointment: Appointment): number {
    return appointment.totalPriceLkr;
  }

  getExtraPayment(appointment: Appointment): number {
    return appointment.extraPayment || 0;
  }

  getTotal(appointment: Appointment): number {
    return appointment.totalPayment;
  }
}

