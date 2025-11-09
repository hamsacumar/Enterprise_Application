import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vehicle, Appointment, CreateAppointmentDto, UpdateStatusDto } from '../models/user-dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {
  private readonly apiBaseUrl = 'http://localhost:5015/api';

  constructor(private http: HttpClient) {}

  // ==================== Vehicles API ====================

  /**
   * Get all vehicles
   * GET /api/Vehicles
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiBaseUrl}/Vehicles`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get vehicle by ID
   * GET /api/Vehicles/{id}
   */
  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiBaseUrl}/Vehicles/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new vehicle
   * POST /api/Vehicles
   */
  createVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiBaseUrl}/Vehicles`, vehicle).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing vehicle
   * PUT /api/Vehicles/{id}
   */
  updateVehicle(vehicle: Vehicle): Observable<void> {
    return this.http.put<void>(`${this.apiBaseUrl}/Vehicles/${vehicle.id}`, vehicle).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a vehicle
   * DELETE /api/Vehicles/{id}
   */
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/Vehicles/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== Appointments API ====================

  /**
   * Get all appointments
   * GET /api/Appointments
   */
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiBaseUrl}/Appointments`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get appointment by ID
   * GET /api/Appointments/{id}
   */
  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiBaseUrl}/Appointments/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new appointment
   * POST /api/Appointments
   */
  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiBaseUrl}/Appointments`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update appointment status
   * PUT /api/Appointments/{id}/status
   */
  updateAppointmentStatus(id: number, status: string): Observable<void> {
    const dto: UpdateStatusDto = { status };
    return this.http.put<void>(`${this.apiBaseUrl}/Appointments/${id}/status`, dto).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== Helper Methods ====================

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // ==================== Legacy Support (for backward compatibility) ====================
  // These methods maintain the same interface as MockData for easy migration

  /**
   * Get available services (hardcoded for now - needs backend endpoint)
   * TODO: Create backend endpoint for services
   */
  getAvailableServices(): Observable<Array<{ id: number; name: string; price: number }>> {
    // For now, return hardcoded services
    // TODO: Replace with actual backend endpoint when available
    return of([
      { id: 1, name: 'Oil Change', price: 5000 },
      { id: 2, name: 'Tire Rotation', price: 3000 },
      { id: 3, name: 'Brake Inspection', price: 4500 },
      { id: 4, name: 'Full Service', price: 15000 },
    ]);
  }

  /**
   * Get summary statistics
   * TODO: Create backend endpoint for summary
   */
  getSummary(): Observable<{
    totalAppointments: number;
    ongoingCount: number;
    myVehicles: number;
  }> {
    // Combine multiple observables to calculate summary
    return forkJoin({
      appointments: this.getAppointments(),
      vehicles: this.getVehicles()
    }).pipe(
      map(({ appointments, vehicles }) => {
        const ongoing = appointments.filter(a => 
          a.status === 'Accepted' || 
          a.status === 'In Progress' ||
          a.status === 'accepted' ||
          a.status === 'in progress'
        );
        return {
          totalAppointments: appointments.length,
          ongoingCount: ongoing.length,
          myVehicles: vehicles.length
        };
      })
    );
  }

  /**
   * Get ongoing services (appointments with status "Accepted" or "In Progress")
   */
  getOngoingServices(): Observable<Appointment[]> {
    return this.getAppointments().pipe(
      map(appointments => 
        appointments.filter(a => 
          a.status === 'Accepted' || 
          a.status === 'In Progress' ||
          a.status === 'accepted' ||
          a.status === 'in progress'
        )
      )
    );
  }
}

