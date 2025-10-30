import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5001/api/services'; // adjust to your .NET endpoint

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
