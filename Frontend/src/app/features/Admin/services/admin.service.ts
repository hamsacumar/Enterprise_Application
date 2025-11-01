import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  private apiUrl = 'http://localhost:5125/api/admin/services'; // backend URL

  // Normalize backend DTO (which may use PascalCase like Id/CreatedAt)
  private toServiceItem = (dto: any): ServiceItem => ({
    id: dto.id ?? dto.Id,
    name: dto.name ?? dto.Name,
    description: dto.description ?? dto.Description,
    price: dto.price ?? dto.Price,
    createdAt: dto.createdAt ?? dto.CreatedAt,
  });

  /** Fetch all services */
  getAllServices(): Observable<ServiceItem[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map(items => items.map(this.toServiceItem)));
  }

  /** Fetch a single service by Id */
  getServiceById(id: string): Observable<ServiceItem> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map(this.toServiceItem));
  }

  /** Add a new service */
  addService(service: Omit<ServiceItem, 'id' | 'createdAt'>): Observable<ServiceItem> {
    return this.http
      .post<any>(this.apiUrl, service)
      .pipe(map(this.toServiceItem));
  }

  /** Update an existing service */
  updateService(id: string, service: Omit<ServiceItem, 'id' | 'createdAt'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, service);
  }

  /** Delete a service */
  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getWorkers() {
  return this.http.get(`${this.apiUrl}/admin/workers`);
}

addWorker(worker: any) {
  return this.http.post(`${this.apiUrl}/admin/workers`, worker);
}

}
