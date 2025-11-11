import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayHereParameters, PayHerePaymentRequest } from '../Models/payhere.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService {

  private apiUrl = 'http://localhost:8080/api/payment/initiate';

  constructor(private http: HttpClient) { }

  // Calls the Spring Boot backend to generate the order ID and Hash
  initiatePayment(request: PayHerePaymentRequest): Observable<PayHereParameters> {
    return this.http.post<PayHereParameters>(this.apiUrl, request);
  }
}
