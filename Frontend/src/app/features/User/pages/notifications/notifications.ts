import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { NotificationService } from '../../../../../../../autoserve/fe/src/app/services/notification.service';
import { MockData } from '../../../../../../../autoserve/fe/src/app/services/mock-data';
=======
import { NotificationService } from '../../mock/notification.service';
import { MockData } from '../../mock/mock-data';
>>>>>>> Stashed changes
=======
import { NotificationService } from '../../mock/notification.service';
import { MockData } from '../../mock/mock-data';
>>>>>>> Stashed changes

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
				this.mock.getAppointment(apptId).subscribe({
					next: (a) => {
						const status = (a?.status || '').toLowerCase();
						if (status === 'accepted') this.statusMap.set(n.id, 'Accepted');
						else if (status === 'rejected') this.statusMap.set(n.id, 'Rejected');
					}
				});
			}
		});
	}

	onAccept(n: any){
		const apptId = n.data?.appointmentId as number | undefined;
		if (!apptId || this.statusMap.has(n.id)) return;
		
		this.statusMap.set(n.id, 'Accepted');
		this.mock.updateAppointmentStatus(apptId, 'Accepted').subscribe({ 
			next: () => {
				const vehicle = n.data?.vehicleLabel || 'Vehicle';
				const type = n.data?.vehicleType || 'Sedan';
				const eta = n.data?.returnDate || '';
				this.mock.addOngoingService({ vehicle, type, progress: 0, status: 'In Progress', eta });
			},
			error: () => {
				this.statusMap.delete(n.id);
			}
		});
	}

	onReject(n: any){
		const apptId = n.data?.appointmentId as number | undefined;
		if (!apptId || this.statusMap.has(n.id)) return;
		
		this.statusMap.set(n.id, 'Rejected');
		this.mock.updateAppointmentStatus(apptId, 'Rejected').subscribe({
			error: () => {
				this.statusMap.delete(n.id);
			}
		});
	}
}


