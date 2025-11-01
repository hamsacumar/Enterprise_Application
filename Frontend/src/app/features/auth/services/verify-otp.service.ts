import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface VerifyOtpRequest {
  otpCode: string;
}

interface VerifyOtpResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VerifyOtpService {
  private apiUrl = 'http://localhost:5143/api/Auth/verify-otp'; // Update with backend URL

  constructor(private http: HttpClient) {}

  verifyOtp(data: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(this.apiUrl, data);
  }

  resendOtp(data: { Email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl.replace('/verify-otp', '')}/resend-otp`, data);
  }
  
}
