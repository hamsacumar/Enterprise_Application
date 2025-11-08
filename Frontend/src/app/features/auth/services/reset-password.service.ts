import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = 'http://localhost:5000/api/Auth/reset-password'; 

  constructor(private http: HttpClient) {}

  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(this.apiUrl, data);
  }
}
