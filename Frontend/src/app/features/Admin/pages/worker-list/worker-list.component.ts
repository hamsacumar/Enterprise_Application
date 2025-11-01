import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
  workers: any[] = [];
  worker: any = { name: '', email: '', contact: '', specialization: '', password: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers() {
    this.adminService.getWorkers().subscribe((res: any) => {
      this.workers = res;
    });
  }

  addWorker() {
    if (!this.worker.name || !this.worker.email || !this.worker.password) return;

    this.adminService.addWorker(this.worker).subscribe(() => {
      this.worker = { name: '', email: '', contact: '', specialization: '', password: '' };
      this.loadWorkers();
    });
  }
}
