import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
<<<<<<< Updated upstream
import { MockData } from '../../services/mock-data';
=======
import { MockData } from '../mock/mock-data';
>>>>>>> Stashed changes
import { map } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private mock = inject(MockData);
  services$ = this.mock.getAppointments().pipe(
    map(list => list.map((a: any) => {
      let vehicleLabel = a.vehicleName && a.vehicleModel ? `${a.vehicleName} ${a.vehicleModel}`.trim() : (a.vehicleName || a.vehicleType || 'Vehicle');
      let typeLabel = '';
      try {
        const items = JSON.parse(a.selectedServicesJson || '[]');
        typeLabel = Array.isArray(items) ? items.map((x: any) => x.name).join(', ') : '';
      } catch { typeLabel = ''; }
      const status = (a.status || '').toLowerCase();
      let mappedStatus = 'Waiting for admin accept';
      if (status === 'accepted' || status === 'accept') mappedStatus = 'Accept';
      else if (status === 'rejected' || status === 'reject') mappedStatus = 'Rejected by user';
      else mappedStatus = 'Waiting for admin accept';
      return {
        id: `APT-${a.id}`,
        vehicle: vehicleLabel,
        type: typeLabel,
        status: mappedStatus,
        date: a.preferredDate
      };
    }))
  );
}
