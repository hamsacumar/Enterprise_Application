import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for ServiceItem
export interface ServiceItem {
  id?: string;       // optional because backend generates it
  name: string;
  description?: string;
  price: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5125/api/services'; // backend URL

  /** Fetch all services */
  getAllServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(this.apiUrl);
  }

  /** Fetch a single service by Id */
  getServiceById(id: string): Observable<ServiceItem> {
    return this.http.get<ServiceItem>(`${this.apiUrl}/${id}`);
  }

  /** Add a new service */
  addService(service: Omit<ServiceItem, 'id' | 'createdAt'>): Observable<ServiceItem> {
    return this.http.post<ServiceItem>(this.apiUrl, service);
  }

  /** Update an existing service */
  updateService(id: string, service: Omit<ServiceItem, 'id' | 'createdAt'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, service);
  }

  /** Delete a service */
  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
