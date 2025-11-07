import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-request-modification',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './request-modification.html',
  styleUrl: './request-modification.css',
})
export class RequestModification {
  model = { vehicle: '', description: '', urgency: 'Normal' };
  submit(){
    alert('Request submitted (dummy)');
    this.model = { vehicle: '', description: '', urgency: 'Normal' };
  }
}
