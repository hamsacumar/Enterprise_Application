import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  firstName: string;
  lastName: string;
  carModel: string;
  carLicensePlate: string;
  phoneNumber: string;
  address: string;
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:5125/api/Customer'; // Your AdminService URL

  constructor(private http: HttpClient) {}

  getCustomer(username: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${username}`);
  }
}
