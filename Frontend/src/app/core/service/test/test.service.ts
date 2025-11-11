import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  api = 'http://localhost:5002/api/test';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http.get<any>(this.api);
  }

  getTestData(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  initializeTestData(): Observable<any> {
    return this.http.post<any>(`${this.api}/init`, {});
  }

  createTestData(data: { number: number }): Observable<any> {
    return this.http.post<any>(this.api, data);
  }
}
