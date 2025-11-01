import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassifyService } from '../../services/classify.service';

@Component({
  selector: 'app-classify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classify.component.html',
  styleUrls: ['./classify.component.css']
})
export class ClassifyComponent {
  username: string = '';
  address: string = '';
  carModel: string = '';
  carLicensePlate: string = '';
  phoneNumber: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private classifyService: ClassifyService, private router: Router) {}

  onClassify() {
    this.classifyService.classify({
      username: this.username,
      address: this.address,
      carModel: this.carModel,
      carLicensePlate: this.carLicensePlate,
      phoneNumber: this.phoneNumber
    }).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Details updated successfully!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect to login
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to update details. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
