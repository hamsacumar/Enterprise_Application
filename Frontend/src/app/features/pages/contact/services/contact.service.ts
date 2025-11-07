import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:5000/api/contact'; // Adjust port as needed

  constructor(private http: HttpClient) { }

  /**
   * Submit a new contact form
   */
  submitContact(request: ContactSubmissionRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/submit`, request);
  }

  /**
   * Get all submissions (Admin only)
   */
  getSubmissions(status?: string, page: number = 1, pageSize: number = 10): Observable<PaginatedContactResponse> {
    let url = `${this.apiUrl}/submissions?page=${page}&pageSize=${pageSize}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<PaginatedContactResponse>(url);
  }

  /**
   * Get submission by ID
   */
  getSubmissionById(id: string): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(`${this.apiUrl}/submissions/${id}`);
  }

  /**
   * Get submissions by email
   */
  getSubmissionsByEmail(email: string): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(`${this.apiUrl}/submissions/email/${email}`);
  }

  /**
   * Update submission status
   */
  updateSubmissionStatus(id: string, status: string, adminNotes?: string): Observable<ContactResponse> {
    return this.http.put<ContactResponse>(`${this.apiUrl}/submissions/${id}/status`, {
      status,
      adminNotes
    });
  }

  /**
   * Delete submission
   */
  deleteSubmission(id: string): Observable<ContactResponse> {
    return this.http.delete<ContactResponse>(`${this.apiUrl}/submissions/${id}`);
  }

  /**
   * Get statistics
   */
  getStatistics(): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(`${this.apiUrl}/statistics`);
  }
}

