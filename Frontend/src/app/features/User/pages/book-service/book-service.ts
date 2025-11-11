import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { ServiceService, Service } from '../../services/service.service';
import { AppointmentService, CreateAppointmentDto } from '../../services/appointment.service';

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './book-service.html',
  styleUrls: ['./book-service.css']
})
export class BookServiceComponent implements OnInit {
  selectedVehicle: Vehicle | null = null;
  selectedServices: Service[] = [];
  isLoadingVehicles: boolean = false;
  isLoadingServices: boolean = false;
  isSubmitting: boolean = false;

  vehicles: Vehicle[] = [];
  availableServices: Service[] = [];

  constructor(
    private vehicleService: VehicleService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadServices();
  }

  loadVehicles(): void {
    this.isLoadingVehicles = true;
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.isLoadingVehicles = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        alert('Failed to load vehicles. Please try again.');
        this.isLoadingVehicles = false;
      }
    });
  }

  loadServices(): void {
    this.isLoadingServices = true;
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.availableServices = services;
        this.isLoadingServices = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        alert('Failed to load services. Please try again.');
        this.isLoadingServices = false;
      }
    });
  }

  toggleService(service: Service): void {
    const index = this.selectedServices.findIndex(s => s.id === service.id);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
  }

  isServiceSelected(serviceId: number): boolean {
    return this.selectedServices.some(s => s.id === serviceId);
  }

  getTotalPrice(): number {
    return this.selectedServices.reduce((sum, service) => sum + service.price, 0);
  }

  submitBooking(): void {
    // Validation
    if (!this.selectedVehicle || this.selectedServices.length === 0) {
      alert('Please select a vehicle and at least one service');
      return;
    }

    this.isSubmitting = true;

    // Prepare services for API
    const services = this.selectedServices.map(service => ({
      id: service.id.toString(),
      name: service.name,
      basePriceLkr: Math.round(service.price),
      finalPriceLkr: Math.round(service.price)
    }));

    // Prepare appointment data - only vehicle and services, other fields will be null
    const appointmentData: CreateAppointmentDto = {
      customerName: null, // Will be filled by admin
      phoneNumber: null, // Will be filled by admin
      vehicleId: this.selectedVehicle.id,
      vehicleName: this.selectedVehicle.name,
      vehicleModel: this.selectedVehicle.model,
      vehicleYear: this.selectedVehicle.year,
      vehicleRegNumber: this.selectedVehicle.regNumber,
      vehicleType: this.selectedVehicle.type,
      services: services,
      totalPriceLkr: Math.round(this.getTotalPrice()),
      appointmentDate: null, // Will be updated by admin
      timeSlot: null, // Will be filled by admin
      note: null, // Will be filled by admin
      extraPayment: null // Will be filled by admin
    };

    // Submit appointment
    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (appointment) => {
        alert('Service booking request submitted successfully! Your request ID is: ' + appointment.id);
        // Reset form
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error booking service:', error);
        alert('Failed to submit booking request. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.selectedVehicle = null;
    this.selectedServices = [];
  }
}
