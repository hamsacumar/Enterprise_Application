import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  DecodeTokenResponse,
  UsersListResponse 
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5155/api/auth'; // HTTP endpoint
  private coreApiUrl = 'http://localhost:5155/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.loadUserFromToken();
  }

  /**
   * Login user with email and password
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { 
      email, 
      password 
    } as LoginRequest).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  /**
   * Decode JWT token from backend
   */
  decodeToken(token: string): Observable<DecodeTokenResponse> {
    return this.http.post<DecodeTokenResponse>(`${this.apiUrl}/decode`, { 
      token 
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          const role = this.normalizeRole((response.user as any).role);
          this.currentUserSubject.next({ ...response.user, role });
        }
      })
    );
  }

  getMeFromCore(): Observable<any> {
    return this.http.get<any>(`${this.coreApiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => {
        if (res?.success && res.user) {
          const role = this.normalizeRole(res.user.role);
          this.currentUserSubject.next({ ...res.user, role });
        }
      })
    );
  }

  /**
   * Get all users categorized by role
   */
  getAllUsers(): Observable<UsersListResponse> {
    return this.http.get<UsersListResponse>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Get current user value
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  /**
   * Check if user is worker
   */
  isWorker(): boolean {
    return this.hasRole('Worker');
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Set JWT token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Get Authorization headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Load user from stored token
   */
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.getMeFromCore().subscribe({
        next: (response) => {
          if (response.success) {
            const role = this.normalizeRole(response.user.role);
            this.currentUserSubject.next({ ...response.user, role });
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  /**
   * Normalize role values from backend to string labels used in UI.
   * Accepts numeric (0,1,2) or string ('0','1','2','Customer','Worker','Admin','User').
   */
  private normalizeRole(role: any): 'Admin' | 'Worker' | 'Customer' {
    if (role === 2 || role === '2' || `${role}`.toLowerCase() === 'admin') return 'Admin';
    if (role === 1 || role === '1' || `${role}`.toLowerCase() === 'worker') return 'Worker';
    // Treat 'User' and 0 as Customer
    return 'Customer';
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry;
    } catch {
      return true;
    }
  }
}

