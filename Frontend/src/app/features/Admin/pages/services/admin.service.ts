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
  private apiUrl = 'http://localhost:5125/api/services'; // correct backend URL

  // Fetch all services from backend
  getAllServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(this.apiUrl);
  }
}
