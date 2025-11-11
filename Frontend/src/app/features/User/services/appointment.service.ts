import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceItemDto {
  id: string;
  name: string;
  basePriceLkr: number;
  finalPriceLkr: number;
}

export interface CreateAppointmentDto {
  customerName?: string | null;
  phoneNumber?: string | null;
  vehicleId: number | null;
  vehicleName: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleRegNumber: string;
  vehicleType: string;
  services: ServiceItemDto[];
  totalPriceLkr: number;
  appointmentDate?: string | null; // ISO date string
  timeSlot?: string | null;
  note?: string | null;
  extraPayment?: number | null;
}

export interface Appointment {
  id: number;
  customerName: string;
  phoneNumber: string;
  status: string;
  vehicleId?: number;
  vehicleName: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleType: string;
  vehicleRegNumber: string;
  selectedServicesJson: string;
  totalPriceLkr: number;
  appointmentDate: string;
  timeSlot: string;
  returnDate?: string;
  returnTime?: string;
  note?: string;
  extraPayment: number;
  isPaid: boolean;
  totalPayment: number;
  createdAtUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5015/api/Appointments';

  constructor(private http: HttpClient) {}

  getAppointments(status?: string): Observable<Appointment[]> {
    const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<Appointment[]>(url);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, dto);
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status });
  }
}

