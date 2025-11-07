import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MockData } from '../../../../services/mock-data';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './my-vehicles.html',
  styleUrl: './my-vehicles.css',
})
export class MyVehicles implements OnInit {
  private mock = inject(MockData);
  private destroyRef = inject(DestroyRef);
  vehicles = signal<Array<{ id: number; name: string; model: string; year: number; regNumber: string; type: string; color?: string }>>([]);

  editingId: number | null = null;
  form: { id: number | null; name: string; model: string; year: number; regNumber: string; type: string; color: string } = {
    id: null, name: '', model: '', year: new Date().getFullYear(), regNumber: '', type: 'Sedan', color: ''
  };
  formOpen = false;

  ngOnInit(){
    this.refresh();
  }

  refresh(){
    this.mock.getMyVehicles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list: Array<{ id: number; name: string; model: string; year: number; regNumber: string; type: string; color?: string }>) => {
          this.vehicles.set(list);
        },
        error: (err: unknown) => {
          console.error('Failed to load vehicles', err);
        }
      });
  }

  startAdd(){
    this.editingId = null;
    this.form = { id: null, name: '', model: '', year: new Date().getFullYear(), regNumber: '', type: 'Sedan', color: '' };
    this.formOpen = true;
  }

  startEdit(v: { id: number; name: string; model: string; year: number; regNumber?: string; type?: string; color?: string }){
    this.editingId = v.id;
    this.form = {
      id: v.id,
      name: v.name,
      model: v.model,
      year: v.year,
      regNumber: v.regNumber || '',
      type: v.type || 'Sedan',
      color: v.color || ''
    };
    this.formOpen = true;
  }

  cancel(){
    this.editingId = null;
    this.formOpen = false;
  }

  save(){
    const { id, name, model, year, regNumber, type, color } = this.form;
    if (!name || !model || !year || !regNumber || !type){
      alert('Please fill all required fields: Name, Model, Year, Registration Number, Type');
      return;
    }
    const done = () => { this.cancel(); this.refresh(); };
    if (id == null){
      this.mock.addVehicle({ name, model, year, regNumber, type, color })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ 
          next: done, 
          error: (err: unknown) => {
            console.error('Add vehicle failed', err);
            alert('Failed to save vehicle. Please ensure the backend is running and try again.');
          }
        });
    } else {
      this.mock.updateVehicle({ id, name, model, year, regNumber, type, color })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ 
          next: done, 
          error: (err: unknown) => {
            console.error('Update vehicle failed', err);
            alert('Failed to update vehicle. Please try again.');
          }
        });
    }
  }

  remove(v: { id: number }){
    if (!confirm('Delete this vehicle?')) return;
    this.mock.deleteVehicle(v.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.refresh(),
        error: (err: unknown) => {
          console.error('Delete vehicle failed', err);
          alert('Failed to delete vehicle. Please try again.');
        }
      });
  }
}
