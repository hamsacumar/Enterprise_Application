import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  token: string;
  role: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5003/api/Auth/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      map(res => ({
        token: res.token ?? res.Token,
        role: res.role ?? res.Role
      } as LoginResponse))
    );
  }
}