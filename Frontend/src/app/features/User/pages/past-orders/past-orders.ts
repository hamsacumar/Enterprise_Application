import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService, Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-past-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './past-orders.html',
  styleUrls: ['./past-orders.css']
})
export class PastOrdersComponent implements OnInit {
  orders: Appointment[] = [];
  isLoading: boolean = false;
  showBillingDetails: { [key: number]: boolean } = {};
  isProcessingPayment: { [key: number]: boolean } = {};

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadPastOrders();
  }

  loadPastOrders(): void {
    this.isLoading = true;
    // Fetch appointments with status: Completed
    this.appointmentService.getAppointments('Completed').subscribe({
      next: (appointments) => {
        this.orders = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading past orders:', error);
        alert('Failed to load past orders. Please try again.');
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
    return 'badge-blue-dark';
  }

  showPayDetails(order: Appointment): void {
    this.showBillingDetails[order.id] = !this.showBillingDetails[order.id];
  }

  processPayment(order: Appointment): void {
    if (confirm(`Confirm payment of Rs. ${order.totalPayment.toFixed(2)}?`)) {
      this.isProcessingPayment[order.id] = true;
      
      // Update appointment to mark as paid
      this.appointmentService.updateStatus(order.id, order.status).subscribe({
        next: () => {
          // Update IsPaid status - you might need to add an endpoint for this
          // For now, we'll just show success message
          alert('Payment processed successfully!');
          order.isPaid = true;
          this.isProcessingPayment[order.id] = false;
          this.showBillingDetails[order.id] = false;
        },
        error: (error) => {
          console.error('Error processing payment:', error);
          alert('Failed to process payment. Please try again.');
          this.isProcessingPayment[order.id] = false;
        }
      });
    }
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
