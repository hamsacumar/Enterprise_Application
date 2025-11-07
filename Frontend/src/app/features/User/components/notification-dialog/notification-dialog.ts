import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MockData } from '../../../../services/mock-data';

@Component({
	selector: 'app-notification-dialog',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	templateUrl: './notification-dialog.html',
	styleUrl: './notification-dialog.css',
})
export class NotificationDialog implements OnInit {
	private mock = inject(MockData);
	constructor(
		public dialogRef: MatDialogRef<NotificationDialog>,
		@Inject(MAT_DIALOG_DATA) public data: { appointmentId: number; returnDate: string; vehicleLabel: string; vehicleType: string }
	){}

	appointment: any = null;
	loading = true;
	services: Array<any> = [];
	isProcessed = false;

	ngOnInit(){
		this.mock.getAppointment(this.data.appointmentId).subscribe({ next: (a) => {
			this.appointment = a;
			try {
				this.services = a?.selectedServicesJson ? JSON.parse(a.selectedServicesJson) : [];
			} catch {
				this.services = [];
			}
			const status = (a?.status || '').toLowerCase();
			this.isProcessed = status === 'accepted' || status === 'rejected';
			this.loading = false;
		}});
	}

	accept(){ 
		if (this.isProcessed) return;
		this.isProcessed = true;
		this.dialogRef.close({ action: 'accept' }); 
	}
	reject(){ 
		if (this.isProcessed) return;
		this.isProcessed = true;
		this.dialogRef.close({ action: 'reject' }); 
	}
}


