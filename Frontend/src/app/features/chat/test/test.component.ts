// src/app/features/chat/test/test.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService, TestData, ApiResponse } from '../../../core/service/chatbox/test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  testData: TestData[] = [];
  loading = false;
  error: string | null = null;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.fetchTestData();
  }

  fetchTestData(): void {
    this.loading = true;
    this.error = null;

    this.testService.getTestData().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.testData = Array.isArray(response.data)
            ? response.data
            : [response.data as TestData];
        } else {
          this.error = response.message || 'Failed to fetch data';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = `Error: ${error.message || 'Failed to connect to server'}`;
        console.error('Error fetching test data:', error);
      },
    });
  }

  initializeData(): void {
    this.loading = true;
    this.error = null;

    this.testService.initializeTestData().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          console.log('Data initialized successfully:', response.message);
          // Refresh data after initialization
          this.fetchTestData();
        } else {
          this.error = response.message || 'Failed to initialize data';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = `Error: ${error.message || 'Failed to connect to server'}`;
        console.error('Error initializing data:', error);
      },
    });
  }

  createNewData(): void {
    this.loading = true;
    this.error = null;

    this.testService.createTestData({ number: 4 }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          console.log('New data created successfully:', response.message);
          // Refresh data after creation
          this.fetchTestData();
        } else {
          this.error = response.message || 'Failed to create data';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = `Error: ${error.message || 'Failed to connect to server'}`;
        console.error('Error creating data:', error);
      },
    });
  }

  refreshData(): void {
    this.fetchTestData();
  }
}
