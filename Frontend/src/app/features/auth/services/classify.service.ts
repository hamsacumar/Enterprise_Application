import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ClassifyRequest {
  username: string;
  address?: string;
  carModel?: string;
  carLicensePlate?: string;
  phoneNumber?: string;
}

interface ClassifyResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassifyService {
  private apiUrl = 'http://localhost:5003/api/Auth/classify';

  constructor(private http: HttpClient) {}

  classify(data: ClassifyRequest): Observable<ClassifyResponse> {
    return this.http.post<ClassifyResponse>(this.apiUrl, data);
  }
}
