// src/app/features/chat/test/test.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../core/service/test/test.service';

export interface TestItem {
  id: string;
  value: number;
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  testData: TestItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.fetchTestData();
  }

  // Fetch data from backend
  fetchTestData(): void {
    this.loading = true;
    this.error = null;

    this.testService.getTestData().subscribe({
      next: (items) => {
        this.loading = false;
        this.testData = items;
      },
      error: (err) => {
        this.loading = false;
        this.error = `Error: ${err.message || 'Failed to connect to server'}`;
        console.error('Error fetching test data:', err);
      },
    });
  }

  initializeData(): void {
    this.loading = true;
    this.error = null;

    this.testService.initializeTestData().subscribe({
      next: () => {
        this.loading = false;
        this.fetchTestData(); // refresh after init
      },
      error: (err) => {
        this.loading = false;
        this.error = `Error: ${err.message || 'Failed to initialize data'}`;
        console.error('Error initializing data:', err);
      },
    });
  }

  createNewData(): void {
    this.loading = true;
    this.error = null;

    this.testService.createTestData({ number: 4 }).subscribe({
      next: () => {
        this.loading = false;
        this.fetchTestData(); // refresh after creation
      },
      error: (err) => {
        this.loading = false;
        this.error = `Error: ${err.message || 'Failed to create data'}`;
        console.error('Error creating data:', err);
      },
    });
  }

  refreshData(): void {
    this.fetchTestData();
  }

  getFormattedNumbers(): string {
    return this.testData.map(item => item.value).join(', ');
  }
}
