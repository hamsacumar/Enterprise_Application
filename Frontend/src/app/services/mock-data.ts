import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { UserDashboardService } from '../features/User/services/user-dashboard.service';
import { Vehicle, Appointment, CreateAppointmentDto } from '../features/User/models/user-dashboard.models';

/**
 * MockData Service - Now connected to real backend APIs
 * 
 * This service maintains backward compatibility with existing components
 * while using the real UserDashboardService for HTTP calls.
 * 
 * All vehicle and appointment operations now connect to the backend API.
 */
@Injectable({ providedIn: 'root' })
export class MockData {
  private userDashboardService = inject(UserDashboardService);
  
  // Keep mock data for services that don't have backend endpoints yet
  private pastOrders$ = new BehaviorSubject<Array<any>>([
    { id: 201, vehicle: 'Toyota Corolla', type: 'Sedan', completedOn: '2024-09-12' },
    { id: 202, vehicle: 'Honda Civic', type: 'Sedan', completedOn: '2024-10-08' },
  ]);
  private payments$ = new BehaviorSubject<Array<any>>([
    { date: '2024-10-08', amount: 15000, method: 'Card', status: 'Paid', invoice: 'INV-1001' },
    { date: '2024-09-12', amount: 5000, method: 'Cash', status: 'Paid', invoice: 'INV-0991' },
  ]);

  // ==================== Services (Hardcoded - needs backend endpoint) ====================
  
  getAvailableServices(): Observable<Array<any>> {
    return this.userDashboardService.getAvailableServices();
  }

  // ==================== Vehicles (Connected to Backend) ====================

  getMyVehicles(): Observable<Array<any>> {
    return this.userDashboardService.getVehicles();
  }

  addVehicle(v: any): Observable<any> {
    // Remove id if present (backend will assign it)
    const { id, ...vehicleData } = v;
    return this.userDashboardService.createVehicle(vehicleData);
  }

  updateVehicle(v: any): Observable<any> {
    return this.userDashboardService.updateVehicle(v as Vehicle).pipe(
      // Return the updated vehicle data
      map(() => v)
    );
  }

  deleteVehicle(id: number): Observable<void> {
    return this.userDashboardService.deleteVehicle(id);
  }

  // ==================== Appointments (Connected to Backend) ====================

  createAppointment(payload: any): Observable<any> {
    // Transform payload to match CreateAppointmentDto
    const dto: CreateAppointmentDto = {
      customerName: payload.customerName,
      phoneNumber: payload.phoneNumber,
      specialInstructions: payload.specialInstructions || null,
      vehicleId: payload.vehicleId || null,
      vehicleName: payload.vehicleName || null,
      vehicleModel: payload.vehicleModel || null,
      vehicleYear: payload.vehicleYear || null,
      vehicleRegNumber: payload.vehicleRegNumber || null,
      vehicleType: payload.vehicleType || null,
      services: payload.services || [],
      totalPriceLkr: payload.totalPriceLkr || 0
    };
    
    return this.userDashboardService.createAppointment(dto);
  }

  getAppointments(): Observable<Array<any>> {
    return this.userDashboardService.getAppointments();
  }

  getAppointment(id: number): Observable<any | undefined> {
    return this.userDashboardService.getAppointment(id);
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.userDashboardService.updateAppointmentStatus(id, status).pipe(
      // Return the status update
      map(() => ({ id, status }))
    );
  }

  // ==================== Ongoing Services (Connected to Backend) ====================

  addOngoingService(item: any): void {
    // This is now handled by the backend - appointments with status "Accepted" or "In Progress"
    // No need to maintain separate list
    console.warn('addOngoingService is deprecated. Use createAppointment instead.');
  }

  getOngoingServices(): Observable<Array<any>> {
    return this.userDashboardService.getOngoingServices();
  }

  // ==================== Summary (Connected to Backend) ====================

  getSummary(): Observable<any> {
    return this.userDashboardService.getSummary();
  }

  // ==================== Past Orders (Mock Data - needs backend endpoint) ====================

  getPastOrders(): Observable<Array<any>> {
    // TODO: Create backend endpoint for past orders
    // For now, return mock data or filter appointments with status "Completed"
    return this.userDashboardService.getAppointments().pipe(
      map(appointments => {
        // Filter completed appointments
        const completed = appointments.filter(a => a.status === 'Completed' || a.status === 'completed');
        // If no completed appointments, return mock data
        return completed.length > 0 ? completed : this.pastOrders$.value;
      })
    );
  }

  // ==================== Payments (Mock Data - needs backend endpoint) ====================

  getPayments(): Observable<Array<any>> {
    // TODO: Create backend endpoint for payments
    return this.payments$.asObservable();
  }
}
