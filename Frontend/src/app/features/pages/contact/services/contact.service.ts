import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ContactSubmissionRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceType: string;
}

export interface ContactSubmission extends ContactSubmissionRequest {
  id: string;
  submittedAt: string;
  status: string;
  adminNotes?: string;
  updatedAt?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PaginatedContactResponse extends ContactResponse {
  total: number;
  page: number;
  pageSize: number;
  data: ContactSubmission[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5155/api/contact';

  constructor(private http: HttpClient) { }

  /**
   * Submit a new contact form
   */
  submitContact(request: ContactSubmissionRequest): Observable<ContactResponse> {
    return this.http.post<any>(`${this.apiUrl}/submit`, request).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
        data: r.data ?? r.Data
      } as ContactResponse))
    );
  }

  /**
   * Get all submissions (Admin only)
   */
  getSubmissions(status?: string, page: number = 1, pageSize: number = 10): Observable<PaginatedContactResponse> {
    let url = `${this.apiUrl}/submissions?page=${page}&pageSize=${pageSize}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
        total: r.total ?? r.Total,
        page: r.page ?? r.Page,
        pageSize: r.pageSize ?? r.PageSize,
        data: (r.data ?? r.Data) as ContactSubmission[]
      } as PaginatedContactResponse))
    );
  }

  /**
   * Get submission by ID
   */
  getSubmissionById(id: string): Observable<ContactResponse> {
    return this.http.get<any>(`${this.apiUrl}/submissions/${id}`).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
        data: r.data ?? r.Data
      } as ContactResponse))
    );
  }

  /**
   * Get submissions by email
   */
  getSubmissionsByEmail(email: string): Observable<ContactResponse> {
    return this.http.get<any>(`${this.apiUrl}/submissions/email/${email}`).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
        data: r.data ?? r.Data
      } as ContactResponse))
    );
  }

  /**
   * Update submission status
   */
  updateSubmissionStatus(id: string, status: string, adminNotes?: string): Observable<ContactResponse> {
    return this.http.put<any>(`${this.apiUrl}/submissions/${id}/status`, {
      status,
      adminNotes
    }).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
        data: r.data ?? r.Data
      } as ContactResponse))
    );
  }

  /**
   * Delete submission
   */
  deleteSubmission(id: string): Observable<ContactResponse> {
    return this.http.delete<any>(`${this.apiUrl}/submissions/${id}`).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
      } as ContactResponse))
    );
  }

  /**
   * Get statistics
   */
  getStatistics(): Observable<ContactResponse> {
    return this.http.get<any>(`${this.apiUrl}/statistics`).pipe(
      map(r => ({
        success: r.success ?? r.Success,
        message: r.message ?? r.Message,
        data: r.data ?? r.Data
      } as ContactResponse))
    );
  }
}

