import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = 'http://localhost:5143/api/Auth/forgot-password'; // Update with backend URL

  constructor(private http: HttpClient) {}

  forgotPassword(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(this.apiUrl, data);
  }
}
