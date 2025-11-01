import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Interfaces
export interface ServiceItem {
  id?: string;
  name: string;
  description?: string;
  price: number;
  createdAt?: string;
}

export interface Worker {
  id?: string;
  name: string;
  email: string;
  contact: string;
  role?: string;
  specialization?: string;
  passwordHash?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5125/api/admin'; // common base

  // ---- Services ----
  private toServiceItem = (dto: any): ServiceItem => ({
    id: dto.id ?? dto.Id,
    name: dto.name ?? dto.Name,
    description: dto.description ?? dto.Description,
    price: dto.price ?? dto.Price,
    createdAt: dto.createdAt ?? dto.CreatedAt,
  });

  getAllServices(): Observable<ServiceItem[]> {
    return this.http.get<any[]>(`${this.baseUrl}/services`)
      .pipe(map(items => items.map(this.toServiceItem)));
  }

  getServiceById(id: string): Observable<ServiceItem> {
    return this.http.get<any>(`${this.baseUrl}/services/${id}`)
      .pipe(map(this.toServiceItem));
  }

  addService(service: Omit<ServiceItem, 'id' | 'createdAt'>): Observable<ServiceItem> {
    return this.http.post<any>(`${this.baseUrl}/services`, service)
      .pipe(map(this.toServiceItem));
  }

  updateService(id: string, service: Omit<ServiceItem, 'id' | 'createdAt'>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/services/${id}`, service);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/services/${id}`);
  }

  // ---- Workers ----
  private toWorker = (dto: any): Worker => ({
    id: dto.id ?? dto.Id,
    name: dto.name ?? dto.Name,
    email: dto.email ?? dto.Email,
    contact: dto.contact ?? dto.Contact,
    role: dto.role ?? dto.Role,
    specialization: dto.specialization ?? dto.Specialization,
    passwordHash: dto.passwordHash ?? dto.PasswordHash
  });

  // ---- Workers ----
getWorkers(): Observable<Worker[]> {
  return this.http.get<any[]>(`${this.baseUrl}/workers`)
    .pipe(map(items => items.map(this.toWorker)));
}

addWorker(worker: Omit<Worker, 'id'>): Observable<Worker> {
  return this.http.post<any>(`${this.baseUrl}/workers`, worker)
    .pipe(map(this.toWorker));
}

updateWorker(id: string, worker: Omit<Worker, 'id'>): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/workers/${id}`, worker);
}

deleteWorker(id: string): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/workers/${id}`);
}

}
