import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService, Vehicle } from '../../services/vehicle.service';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './my-vehicles.html',
  styleUrls: ['./my-vehicles.css']
})
export class MyVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  isSubmitting: boolean = false;
  
  vehicleForm: Vehicle = {
    id: 0,
    name: '',
    model: '',
    year: new Date().getFullYear(),
    regNumber: '',
    type: 'Car',
    color: ''
  };

  vehicleTypes = ['Car', 'Bike', 'Van', 'SUV', 'Truck'];
  currentYear = new Date().getFullYear();
  yearRange: number[] = [];

  constructor(private vehicleService: VehicleService) {
    // Generate year range (last 30 years to future 5 years)
    for (let i = this.currentYear - 30; i <= this.currentYear + 5; i++) {
      this.yearRange.push(i);
    }
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        alert('Failed to load vehicles. Please try again.');
      }
    });
  }

  openAddModal(): void {
    this.vehicleForm = {
      id: 0,
      name: '',
      model: '',
      year: this.currentYear,
      regNumber: '',
      type: 'Car',
      color: ''
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.vehicleForm = {
      id: 0,
      name: '',
      model: '',
      year: this.currentYear,
      regNumber: '',
      type: 'Car',
      color: ''
    };
  }

  openEditModal(vehicle: Vehicle): void {
    this.vehicleForm = { ...vehicle };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.vehicleForm = {
      id: 0,
      name: '',
      model: '',
      year: this.currentYear,
      regNumber: '',
      type: 'Car',
      color: ''
    };
  }

  addVehicle(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    const vehicleData = {
      name: this.vehicleForm.name,
      model: this.vehicleForm.model,
      year: this.vehicleForm.year,
      regNumber: this.vehicleForm.regNumber,
      type: this.vehicleForm.type,
      color: this.vehicleForm.color || undefined
    };

    this.vehicleService.addVehicle(vehicleData).subscribe({
      next: (newVehicle) => {
        this.vehicles.push(newVehicle);
        this.closeAddModal();
        this.isSubmitting = false;
        alert('Vehicle added successfully!');
      },
      error: (error) => {
        console.error('Error adding vehicle:', error);
        alert('Failed to add vehicle. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  updateVehicle(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.vehicleService.updateVehicle(this.vehicleForm.id, this.vehicleForm).subscribe({
      next: () => {
        const index = this.vehicles.findIndex(v => v.id === this.vehicleForm.id);
        if (index > -1) {
          this.vehicles[index] = { ...this.vehicleForm };
        }
        this.closeEditModal();
        this.isSubmitting = false;
        alert('Vehicle updated successfully!');
      },
      error: (error) => {
        console.error('Error updating vehicle:', error);
        alert('Failed to update vehicle. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  editVehicle(vehicle: Vehicle): void {
    this.openEditModal(vehicle);
  }

  deleteVehicle(vehicleId: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
          alert('Vehicle deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting vehicle:', error);
          alert('Failed to delete vehicle. Please try again.');
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.vehicleForm.name || !this.vehicleForm.name.trim()) {
      alert('Please enter vehicle name (e.g., Toyota, Honda)');
      return false;
    }
    if (!this.vehicleForm.model || !this.vehicleForm.model.trim()) {
      alert('Please enter vehicle model (e.g., Camry, Civic)');
      return false;
    }
    if (!this.vehicleForm.regNumber || !this.vehicleForm.regNumber.trim()) {
      alert('Please enter registration number');
      return false;
    }
    if (!this.vehicleForm.type) {
      alert('Please select vehicle type');
      return false;
    }
    if (this.vehicleForm.year < 1900 || this.vehicleForm.year > this.currentYear + 5) {
      alert('Please enter a valid year');
      return false;
    }
    return true;
  }
}
