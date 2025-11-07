import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockData {
  private vehicles$ = new BehaviorSubject<Array<any>>([
    { id: 1, name: 'Toyota', model: 'Corolla', year: 2018, regNumber: 'ABC-1234', type: 'Sedan', color: 'White' },
    { id: 2, name: 'Honda', model: 'Civic', year: 2020, regNumber: 'XYZ-5678', type: 'Sedan', color: 'Black' },
  ]);

  private appointments$ = new BehaviorSubject<Array<any>>([]);
  private ongoing$ = new BehaviorSubject<Array<any>>([]);
  private pastOrders$ = new BehaviorSubject<Array<any>>([
    { id: 201, vehicle: 'Toyota Corolla', type: 'Sedan', completedOn: '2024-09-12' },
    { id: 202, vehicle: 'Honda Civic', type: 'Sedan', completedOn: '2024-10-08' },
  ]);
  private payments$ = new BehaviorSubject<Array<any>>([
    { date: '2024-10-08', amount: 15000, method: 'Card', status: 'Paid', invoice: 'INV-1001' },
    { date: '2024-09-12', amount: 5000, method: 'Cash', status: 'Paid', invoice: 'INV-0991' },
  ]);

  private idSeq = 1000;

  getAvailableServices(): Observable<Array<any>> {
    return of([
      { id: 1, name: 'Oil Change', price: 5000 },
      { id: 2, name: 'Tire Rotation', price: 3000 },
      { id: 3, name: 'Brake Inspection', price: 4500 },
      { id: 4, name: 'Full Service', price: 15000 },
    ]);
  }

  getMyVehicles(): Observable<Array<any>> { return this.vehicles$.asObservable(); }

  addVehicle(v: any): Observable<any> {
    const id = ++this.idSeq;
    this.vehicles$.next([ ...this.vehicles$.value, { id, ...v } ]);
    return of({ id, ...v });
  }

  updateVehicle(v: any): Observable<any> {
    this.vehicles$.next(this.vehicles$.value.map(x => x.id === v.id ? { ...x, ...v } : x));
    return of(v);
  }

  deleteVehicle(id: number): Observable<void> {
    this.vehicles$.next(this.vehicles$.value.filter(x => x.id !== id));
    return of(void 0);
  }

  createAppointment(payload: any): Observable<any> {
    const id = ++this.idSeq;
    const selectedServicesJson = JSON.stringify(payload.services || []);
    const rec = { id, ...payload, selectedServicesJson, status: 'Pending' };
    this.appointments$.next([ ...this.appointments$.value, rec ]);
    return of(rec);
  }

  getAppointments(): Observable<Array<any>> { return this.appointments$.asObservable(); }

  getAppointment(id: number): Observable<any | undefined> {
    return of(this.appointments$.value.find(a => a.id === id));
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    this.appointments$.next(this.appointments$.value.map(a => a.id === id ? { ...a, status } : a));
    return of({ id, status });
  }

  addOngoingService(item: any): void {
    this.ongoing$.next([ ...this.ongoing$.value, item ]);
  }

  getOngoingServices(): Observable<Array<any>> { return this.ongoing$.asObservable(); }

  getPastOrders(): Observable<Array<any>> { return this.pastOrders$.asObservable(); }

  getPayments(): Observable<Array<any>> { return this.payments$.asObservable(); }

  getSummary(): Observable<any> {
    return of({
      totalAppointments: this.appointments$.value.length,
      ongoingCount: this.ongoing$.value.length,
      myVehicles: this.vehicles$.value.length,
    });
  }
}
