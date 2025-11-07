import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../services/notification.service';
import { MockData } from '../../../../services/mock-data';

@Component({
	selector: 'app-notifications',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css',
})
export class NotificationsPage implements OnInit {
	private notificationsSvc = inject(NotificationService);
	private mock = inject(MockData);
	private destroyRef = inject(DestroyRef);

	notifications = computed(() => this.notificationsSvc.notifications());
	statusMap = new Map<number, 'Accepted' | 'Rejected' | null>();

	getStatus(n: any): 'Accepted' | 'Rejected' | null {
		return this.statusMap.get(n.id) || null;
	}

	ngOnInit() {
		this.notificationsSvc.markAllRead();
		// Load appointment statuses from backend
		const notifs = this.notifications();
		notifs.forEach(n => {
			const apptId = n.data?.appointmentId as number | undefined;
			if (apptId) {
				this.mock.getAppointment(apptId)
					.pipe(takeUntilDestroyed(this.destroyRef))
					.subscribe({
						next: (a: any) => {
							const status = (a?.status || '').toLowerCase();
							if (status === 'accepted') this.statusMap.set(n.id, 'Accepted');
							else if (status === 'rejected') this.statusMap.set(n.id, 'Rejected');
						},
						error: (err: unknown) => {
							console.error('Failed to load appointment status', err);
						}
					});
			}
		});
	}

	onAccept(n: any){
		const apptId = n.data?.appointmentId as number | undefined;
		if (!apptId || this.statusMap.has(n.id)) return;
		
		this.statusMap.set(n.id, 'Accepted');
		this.mock.updateAppointmentStatus(apptId, 'Accepted')
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({ 
				next: () => {
					const vehicle = n.data?.vehicleLabel || 'Vehicle';
					const type = n.data?.vehicleType || 'Sedan';
					const eta = n.data?.returnDate || '';
					this.mock.addOngoingService({ vehicle, type, progress: 0, status: 'In Progress', eta });
				},
				error: (err: unknown) => {
					console.error('Failed to accept appointment', err);
					this.statusMap.delete(n.id);
					alert('Failed to accept appointment. Please try again.');
				}
			});
	}

	onReject(n: any){
		const apptId = n.data?.appointmentId as number | undefined;
		if (!apptId || this.statusMap.has(n.id)) return;
		
		this.statusMap.set(n.id, 'Rejected');
		this.mock.updateAppointmentStatus(apptId, 'Rejected')
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					// Appointment rejected successfully
				},
				error: (err: unknown) => {
					console.error('Failed to reject appointment', err);
					this.statusMap.delete(n.id);
					alert('Failed to reject appointment. Please try again.');
				}
			});
	}
}


