import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MockData } from '../../../../services/mock-data';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './book-service.html',
  styleUrl: './book-service.css',
})
export class BookService {
  private mock = inject(MockData);
  private router = inject(Router);
  private notifications = inject(NotificationService);
  
  availableServices$ = this.mock.getAvailableServices();
  vehicles$ = this.mock.getMyVehicles();
  
  selectedServices: Array<any> = [];
  selectedVehicle: any = null;
  // Preferred date/time removed
  customerName = '';
  phoneNumber = '';
  specialInstructions = '';
  manualVehicleForm: any = { name: '', model: '', type: 'Sedan', year: new Date().getFullYear(), regNumber: '' };

  toggleService(service: any) {
    const idx = this.selectedServices.findIndex(s => s.id === service.id);
    if (idx >= 0) this.selectedServices.splice(idx, 1);
    else this.selectedServices.push(service);
    this.selectedServices = [...this.selectedServices];
  }

  isSelected(service: any): boolean { return this.selectedServices.some(s => s.id === service.id); }

  effectiveVehicleType(): string {
    const type = this.selectedVehicle?.type || this.manualVehicleForm?.type || 'Sedan';
    return type;
  }

  totalPriceLkr(): number {
    const type = this.effectiveVehicleType();
    const multiplierMap: Record<string, number> = {
      'Sedan': 1.0,
      'Hatchback': 0.95,
      'SUV': 1.2,
      'MUV': 1.15,
      'Coupe': 1.1,
      'Pickup': 1.25
    };
    const m = multiplierMap[type] ?? 1.0;
    const base = this.selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
    return Math.round(base * m);
  }

  bookService() {
    const hasSelectedVehicle = !!this.selectedVehicle || (
      !!this.manualVehicleForm.name && !!this.manualVehicleForm.model && !!this.manualVehicleForm.type && !!this.manualVehicleForm.year && !!this.manualVehicleForm.regNumber
    );
    if (this.selectedServices.length === 0 || !hasSelectedVehicle || !this.customerName || !this.phoneNumber) {
      alert('Please fill all required fields');
      return;
    }

    const vehicleType = this.effectiveVehicleType();
    const servicesPayload = this.selectedServices.map(s => ({
      id: s.id,
      name: s.name,
      basePriceLkr: Number(s.price) || 0,
      finalPriceLkr: 0 // server not recalculating; client comp totals
    }));

    const payload: any = {
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      preferredDate: null,
      preferredTime: null,
      specialInstructions: this.specialInstructions || null,
      vehicleId: this.selectedVehicle?.id ?? null,
      vehicleName: this.selectedVehicle ? null : this.manualVehicleForm.name,
      vehicleModel: this.selectedVehicle ? null : this.manualVehicleForm.model,
      vehicleYear: this.selectedVehicle ? null : Number(this.manualVehicleForm.year) || null,
      vehicleRegNumber: this.selectedVehicle ? null : this.manualVehicleForm.regNumber,
      vehicleType: vehicleType,
      services: servicesPayload,
      totalPriceLkr: this.totalPriceLkr()
    };

    this.mock.createAppointment(payload).subscribe({
      next: (created: any) => {
        console.log('Appointment created:', created);
        const id = created?.id || Date.now(); // Use timestamp if no ID
        const baseDate = new Date();
        const returnDate = new Date(baseDate);
        returnDate.setDate(baseDate.getDate() + 5);
        const returnDateStr = returnDate.toISOString().slice(0,10);
        const vehicleLabel = this.selectedVehicle ? `${this.selectedVehicle.name} ${this.selectedVehicle.model}`.trim() : `${this.manualVehicleForm.name} ${this.manualVehicleForm.model}`.trim();
        const vehicleType = this.selectedVehicle?.type || this.manualVehicleForm?.type || 'Sedan';
        
        // Simulate admin acceptance: automatically create notification with return date
        const notificationText = `Admin scheduled return date ${returnDateStr} for your appointment APT-${id}. Click to accept or reject.`;
        this.notifications.add(notificationText, {
          appointmentId: id,
          returnDate: returnDateStr,
          vehicleLabel,
          vehicleType
        });
        console.log('Notification added. Count:', this.notifications.unreadCount());
        alert('Appointment request submitted. You will receive a notification.');
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        console.error('Create appointment failed', err);
        // Still add notification even if backend fails (for testing)
        const id = Date.now();
        const baseDate = new Date();
        const returnDate = new Date(baseDate);
        returnDate.setDate(baseDate.getDate() + 5);
        const returnDateStr = returnDate.toISOString().slice(0,10);
        const vehicleLabel = this.selectedVehicle ? `${this.selectedVehicle.name} ${this.selectedVehicle.model}`.trim() : `${this.manualVehicleForm.name} ${this.manualVehicleForm.model}`.trim();
        const vehicleType = this.selectedVehicle?.type || this.manualVehicleForm?.type || 'Sedan';
        this.notifications.add(`Admin scheduled return date ${returnDateStr} for your appointment APT-${id}. Click to accept or reject.`, {
          appointmentId: id,
          returnDate: returnDateStr,
          vehicleLabel,
          vehicleType
        });
        alert('Appointment request submitted (offline mode). Check notifications.');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  getTimeSlots(): string[] {
    return ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  }
}
