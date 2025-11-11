// src/app/features/chat/test/service/test.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TestData {
  _id: string;
  number: number;
  createdAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: TestData | TestData[];
}

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = 'http://localhost:5002/api/test';

  constructor(private http: HttpClient) {}

  // Fetch all test data from backend
  getTestData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  // Initialize database with number 4
  initializeTestData(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/init`, {});
  }

  // Create new test data
  createTestData(data: { number: number }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, data);
  }
}
