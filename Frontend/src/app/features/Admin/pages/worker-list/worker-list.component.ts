import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Worker } from '../../services/admin.service';

type WorkerWithMenu = Worker & { showMenu?: boolean };

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css'],
})
export class WorkerListComponent implements OnInit {
  private adminService = inject(AdminService);

  workers: WorkerWithMenu[] = [];
  loading = true;
  error: string | null = null;

  // Add form
  showAddForm = false;
  newWorker: Partial<Worker> = {
    name: '',
    email: '',
    contact: '',
    specialization: '',
    passwordHash: '',
  };

  // Edit form
  editingWorkerId: string | null = null;
  editingWorker: Partial<Worker> = {};

  ngOnInit(): void {
    this.loadWorkers();
  }

  /** Fetch all workers */
  loadWorkers(): void {
    this.loading = true;
    this.adminService.getWorkers().subscribe({
      next: (data) => {
        this.workers = data.map((item) => ({ ...item, showMenu: false }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading workers:', err);
        this.error = 'Failed to load workers';
        this.loading = false;
      },
    });
  }

  /** Add form toggle */
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newWorker = {
      name: '',
      email: '',
      contact: '',
      specialization: '',
      passwordHash: '',
    };
  }

  /** Add worker */
  addWorker(): void {
    if (
      !this.newWorker.name ||
      !this.newWorker.email ||
      !this.newWorker.passwordHash
    )
      return;

    this.adminService.addWorker(this.newWorker as Worker).subscribe({
      next: () => {
        this.loadWorkers();
        this.showAddForm = false;
      },
      error: (err) => console.error('Error adding worker:', err),
    });
  }

  cancelAdd(): void {
    this.showAddForm = false;
  }

  /** Edit worker */
  editWorker(worker: WorkerWithMenu): void {
    const id = this.getWorkerId(worker);
    this.editingWorkerId = id;
    this.editingWorker = { ...worker };
  }

  /** Save worker */
  saveWorker(): void {
    if (!this.editingWorkerId) return;
    this.adminService
      .updateWorker(this.editingWorkerId, this.editingWorker as Worker)
      .subscribe({
        next: () => {
          this.loadWorkers();
          this.editingWorkerId = null;
        },
        error: (err) => console.error('Error updating worker:', err),
      });
  }

  cancelEdit(): void {
    this.editingWorkerId = null;
  }

  /** Delete worker */
  deleteWorker(worker: WorkerWithMenu): void {
    const id = this.getWorkerId(worker);
    if (!confirm(`Delete "${worker.name}"?`)) return;

    this.adminService.deleteWorker(id).subscribe({
      next: () => this.loadWorkers(),
      error: (err) => console.error('Error deleting worker:', err),
    });
  }

  /** Dropdown menu controls */
  toggleMenu(worker: WorkerWithMenu, event: MouseEvent): void {
    event.stopPropagation();
    const wasOpen = worker.showMenu;
    this.closeAllMenus();
    worker.showMenu = !wasOpen;
  }

  closeAllMenus(): void {
    this.workers.forEach((w) => (w.showMenu = false));
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-container')) this.closeAllMenus();
  }

  getWorkerId(worker: WorkerWithMenu): string {
    return (worker as any).id ?? (worker as any).Id ?? '';
  }
}
